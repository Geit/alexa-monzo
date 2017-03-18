'use strict';

const moment = require('moment');
const monzo = require('../monzo');
const utils = require('../utils');
const t = require('../translator').translate;

module.exports = function () {
  const monzoUser = monzo.monzoUser(this);
  if (!monzoUser) return;

  monzoUser.getAccounts().then((accounts) => {
    const timePeriod = moment();
    let duration = moment.duration(1, 'months');
    let category = null;

    if (this.event.request.intent.slots.duration && this.event.request.intent.slots.duration.value)
      duration = moment.duration(this.event.request.intent.slots.duration.value);

    timePeriod.subtract(duration);

    if (this.event.request.intent.slots.TransactionCategory && this.event.request.intent.slots.TransactionCategory.value)
      category = this.event.request.intent.slots.TransactionCategory.value;

    monzoUser.getTransactions(accounts[0].id, { since: timePeriod.format('YYYY-MM-DD[T]HH:mm:ss[Z]') }).then((transactions) => {
      let sumOfSpending = 0;
      transactions.forEach((transaction) => {
        if (category && transaction.category !== category)
          return;
        if (transaction.amount < 0) sumOfSpending += Math.abs(transaction.amount);
      });

      let response = '';
      if (sumOfSpending > 0) {
        if (category)
          response = t(this.locale, 'SpendingTotalWithCategory', { amount: utils.currencyToWords(sumOfSpending), category, duration: duration.humanize().replace('a ', '') });
        else
          response = t(this.locale, 'SpendingTotal', { amount: utils.currencyToWords(sumOfSpending), duration: duration.humanize().replace('a ', '') });
      } else if (category) {
        response = t(this.locale, 'NoSpendingWithCategory', { category, duration: duration.humanize().replace('a ', '') });
      } else {
        response = t(this.locale, 'NoSpending', { duration: duration.humanize().replace('a ', '') });
      }

      if (!this.event.session.new)
        this.emit(':ask', `${response} ${t(this.locale, 'ContinueSessionPrompt')}`, t(this.locale, 'Reprompt'));
      else
        this.emit(':tell', response);
    });
  }).catch(utils.handleMonzoError.bind(this));
};
