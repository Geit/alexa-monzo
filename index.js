'use strict';
const Alexa = require('alexa-sdk');
const moment = require('moment');
const monzo = require('./monzo');
const async = require('async');
const _ = require('underscore');

exports.handler = function (event, context, callback) {
  console.log(context.logGroupName);
  console.log(context.logStreamName);
  const alexa = Alexa.handler(event, context);
  alexa.registerHandlers(handlers);
  alexa.execute();
};

const handlers = {
  GetBalance () {
    const monzoUser = monzo.monzoUser(getAndValidiateMonzoAuthToken(this));
    if (!monzoUser) return;

    monzoUser.getAccounts().then((accounts) => {
      const responseParts = [];

      async.mapLimit(accounts, 4,
        (account, callback) => {
          monzoUser.getBalance(accounts[0].id).then((balanceResponse) => {
            account.balance = balanceResponse;
            callback(null, account);
          });
        },
        (err, accountsWithBalances) => {
          if (err) console.error(err);
          if (accountsWithBalances.length > 1) {
            responseParts.push(`You have ${accounts.length} accouts with Monzo, with a balance of their balances are: `);
            accountsWithBalances.forEach((account) => {
              responseParts.push(`${account.description}'s account has a balance of ${currencyToWords(account.balance.balance, account.balance.currency)}`);
            });
          } else {
            responseParts.push(`The balance for ${accountsWithBalances[0].description}'s account is ${currencyToWords(accountsWithBalances[0].balance.balance, accountsWithBalances[0].balance.currency)}`);
          }

          this.emit(':tell', responseParts.join(' '));
        }
      );
    }).catch(handleMonzoError.bind(this));
  },

  GetSpendingToday () {
    const monzoUser = monzo.monzoUser(getAndValidiateMonzoAuthToken(this));
    if (!monzoUser) return;

    monzoUser.getAccounts().then((accounts) => {
      monzoUser.getBalance(accounts[0].id).then((balanceResponse) => {
        if (balanceResponse.spend_today > 0)
          this.emit(':tell', `You've desposited a total of ${currencyToWords(balanceResponse.spend_today, balanceResponse.local_currency || balanceResponse.currency)} today`);
        else if (balanceResponse.spend_today < 0)
          this.emit(':tell', `You've spent a total of ${currencyToWords(Math.abs(balanceResponse.spend_today), balanceResponse.local_currency || balanceResponse.currency)} today`);
        else
          this.emit(':tell', `You haven't spent anything yet today!`);
      });
    }).catch(handleMonzoError.bind(this));
  },

  GetSpendingHistory () {
    const monzoUser = monzo.monzoUser(getAndValidiateMonzoAuthToken(this));
    if (!monzoUser) return;

    monzoUser.getAccounts().then((accounts) => {
      const timePeriod = moment();
      let duration = null;
      let category = null;
      let categoryString = '';
      if (this.event.request.intent.slots.duration && this.event.request.intent.slots.duration.value) {
        duration = moment.duration(this.event.request.intent.slots.duration.value);
        timePeriod.subtract(duration);
      }
      if (this.event.request.intent.slots.TransactionCategory && this.event.request.intent.slots.TransactionCategory.value) {
        category = this.event.request.intent.slots.TransactionCategory.value;
        categoryString = `on ${category}`;
      }
      monzoUser.getTransactions(accounts[0].id, {since: timePeriod.format('YYYY-MM-DD[T]HH:mm:ss[Z]')}).then((transactions) => {
        let sumOfSpending = 0;
        transactions.forEach((transaction) => {
          if (category && transaction.category !== category)
            return;
          if (transaction.amount < 0) sumOfSpending += Math.abs(transaction.amount);
        });

        if (sumOfSpending > 0)
          this.emit(':tell', `You've spent a total of ${currencyToWords(sumOfSpending)} ${categoryString} in the last ${duration.humanize()}`);
        else
          this.emit(':tell', `You haven't spent anything ${categoryString} in the last ${duration.humanize()}!`);
      });
    }).catch(handleMonzoError.bind(this));
  },

  GetTargets () {
    const monzoUser = monzo.monzoUser(getAndValidiateMonzoAuthToken(this));
    if (!monzoUser) return;

    monzoUser.getAccounts().then((accounts) => {
      monzoUser.getTargets(accounts[0].id).then((targets) => {
        if (!targets.targets.length)
          return this.emit(':tell', `You don't have any targets! Set some up in the Monzo App!`);

        // TODO maybe give special treatment to the "total" target
        const targetBuckets = _.groupBy(targets.targets, 'status');
        if (targetBuckets['OKAY'] && targetBuckets['OKAY'].length === targets.targets.length) {
          this.emit(':tell', `You're currently within all your targets for this ${targets.interval_type}`);
        } else {
          const responseParts = [];
          if (targetBuckets['EXCEEDED'] && targetBuckets['EXCEEDED'].length)
            responseParts.push(`You've exceeded your target for the following categories: ${_.pluck(targetBuckets['EXCEEDED'], 'name').join(' ').replace('_', ' ')}.`);

          // TODO what's the name of the off-target state?

          if (targetBuckets['OKAY'] && targetBuckets['OKAY'].length)
            responseParts.push(`You're still on target for the following categories: ${_.pluck(targetBuckets['OKAY'], 'name').join(' ').replace('_', ' ')}`);

          this.emit(':tell', responseParts.join(' '));
        }
      });
    }).catch(handleMonzoError.bind(this));
  },

  Unhandled () {
    this.emit(':tell', `I'm sorry, I didn't know what to do with your request!`);
  }
};

function handleMonzoError (reason) {
  if (reason.error && reason.error.code === 'unauthorized.bad_access_token') {
    this.emit(':tellWithLinkAccountCard', 'Your Monzo access token appears to be invalid, please regenerate it');
  } else {
    console.error(reason);
    this.emit(':tell', `Sorry. I wasn't able to reach Monzo at this time`);
  }
}

function getAndValidiateMonzoAuthToken (context) {
  return context.event.session.user.accessToken || context.emit(':tellWithLinkAccountCard', 'Please link your Monzo account in the Alexa App first') && false;
}

const currencyDefinition = {
  'GBP': {
    majorCurrencyUnit (amount) {
      return amount === 1 ? 'pound' : 'pounds';
    },
    minorCurrencyUnit (amount) {
      return 'pence';
    }
  },
  'EUR': {
    majorCurrencyUnit (amount) {
      return amount === 1 ? 'euro' : 'euros';
    },
    minorCurrencyUnit (amount) {
      return amount === 1 ? 'cent' : 'cents';
    }
  },
  'USD': {
    majorCurrencyUnit (amount) {
      return amount === 1 ? 'dollar' : 'dollars';
    },
    minorCurrencyUnit (amount) {
      return amount === 1 ? 'cent' : 'cents';
    }
  }
};

// Surprised Alexa doesn't have a SSML say-as tag for currency, maybe it's undocumented?
function currencyToWords (amount, currency) {
  currency = currency || 'GBP';

  const amountParts = (amount / 100).toFixed(2).toString().split('.');

  const majorUnits = +amountParts[0];
  const minorUnits = +amountParts[1];

  const responseParts = [];

  if (majorUnits !== 0 || minorUnits === 0)
    responseParts.push(`${majorUnits} ${currencyDefinition[currency].majorCurrencyUnit(majorUnits)}`);

  if (minorUnits !== 0 || majorUnits === 0)
    responseParts.push(`${minorUnits} ${currencyDefinition[currency].minorCurrencyUnit(minorUnits)}`);

  return responseParts.join(' and ');
}
