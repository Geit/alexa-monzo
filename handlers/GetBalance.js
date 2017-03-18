'use strict';

const monzo = require('../monzo');
const async = require('async');
const utils = require('../utils');
const t = require('../translator').translate;

module.exports = function () {
  const monzoUser = monzo.monzoUser(this);
  if (!monzoUser) return;

  monzoUser.getAccounts().then((accounts) => {
    const responseParts = [];

    async.mapLimit(accounts, 4,
      (account, callback) => {
        monzoUser.getBalance(account.id).then((balanceResponse) => {
          account.balance = balanceResponse;
          callback(null, account);
        });
      },
      (err, accountsWithBalances) => {
        if (err) console.error(err);
        if (accountsWithBalances.length > 1) {
          responseParts.push(t(this.locale, 'NumberOfAccountsWithMonzo', { count: accounts.length }));
          accountsWithBalances.forEach((account) => {
            responseParts.push(t(this.locale, 'MultipleAccountBalanceWithName', { name: account.description, balance: utils.currencyToWords(account.balance.balance, account.balance.currency) }));
          });
        } else {
          responseParts.push(t(this.locale, 'SingleAccountBalanceWithName', { name: accountsWithBalances[0].description, balance: utils.currencyToWords(accountsWithBalances[0].balance.balance, accountsWithBalances[0].balance.currency) }));
        }
        if (!this.event.session.new)
          this.emit(':ask', `${responseParts.join(' ')} ${t(this.locale, 'ContinueSessionPrompt')}`, t(this.locale, 'Reprompt'));
        else
          this.emit(':tell', responseParts.join(' '));
      }
    );
  }).catch(utils.handleMonzoError.bind(this));
};
