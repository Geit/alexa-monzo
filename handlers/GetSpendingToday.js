'use strict';
const monzo = require('../monzo');
const utils = require('../utils');

module.exports = function () {
  const monzoUser = monzo.monzoUser(utils.getAndValidiateMonzoAuthToken(this));
  if (!monzoUser) return;

  monzoUser.getAccounts().then((accounts) => {
    monzoUser.getBalance(accounts[0].id).then((balanceResponse) => {
      if (balanceResponse.spend_today > 0)
        this.emit(':tell', `You've desposited a total of ${utils.currencyToWords(balanceResponse.spend_today, balanceResponse.local_currency || balanceResponse.currency)} today`);
      else if (balanceResponse.spend_today < 0)
        this.emit(':tell', `You've spent a total of ${utils.currencyToWords(Math.abs(balanceResponse.spend_today), balanceResponse.local_currency || balanceResponse.currency)} today`);
      else
        this.emit(':tell', `You haven't spent anything yet today!`);
    });
  }).catch(utils.handleMonzoError.bind(this));
};
