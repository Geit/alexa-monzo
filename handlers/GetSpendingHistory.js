const moment = require('moment');
const monzo = require('../monzo');
const utils = require('../utils');

module.exports = function () {
  const monzoUser = monzo.monzoUser(utils.getAndValidiateMonzoAuthToken(this));
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
        this.emit(':tell', `You've spent a total of ${utils.currencyToWords(sumOfSpending)} ${categoryString} in the last ${duration.humanize()}`);
      else
        this.emit(':tell', `You haven't spent anything ${categoryString} in the last ${duration.humanize()}!`);
    });
  }).catch(utils.handleMonzoError.bind(this));
};
