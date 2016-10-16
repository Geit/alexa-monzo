'use strict';
const moment = require('moment');
const monzo = require('../monzo');
const utils = require('../utils');

module.exports = function () {
  const monzoUser = monzo.monzoUser(this);
  if (!monzoUser) return;

  monzoUser.getAccounts().then((accounts) => {
    const timePeriod = moment();
    let duration = moment.duration(1, 'months');
    let category = null;
    let categoryString = '';

    if (this.event.request.intent.slots.duration && this.event.request.intent.slots.duration.value)
      duration = moment.duration(this.event.request.intent.slots.duration.value);

    timePeriod.subtract(duration);

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

      let response = '';
      if (sumOfSpending > 0)
        response = `You've spent a total of ${utils.currencyToWords(sumOfSpending)} ${categoryString} in the last ${duration.humanize().replace('a ', '')}.`;
      else
        response = `You haven't spent anything ${categoryString} in the last ${duration.humanize()}!`;

      if (!this.event.session.new)
        this.emit(':ask', `${response}. Can I assist you with anything else?`, `You can ask me how much you've spent recently, or how you're doing with your targets.`);
      else
          this.emit(':tell', response);
    });
  }).catch(utils.handleMonzoError.bind(this));
};
