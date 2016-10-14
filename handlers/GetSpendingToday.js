'use strict';
const monzo = require('../monzo');
const utils = require('../utils');
const async = require('async');

module.exports = function () {
  const monzoUser = monzo.monzoUser(utils.getAndValidiateMonzoAuthToken(this));
  if (!monzoUser) return;

  monzoUser.getAccounts().then((accounts) => {
    let spendSum = 0;
    let currency = 'GBP';
    async.each(accounts,
      (account, cb) => {
        monzoUser.getBalance(account.id).then((balanceResponse) => {
          if (balanceResponse.spend_today < 0)
            spendSum += balanceResponse.spend_today;
          currency = balanceResponse.currency;
          cb();
        });
      },
      () => {
        if (spendSum < 0)
          this.emit(':tell', `You've spent a total of ${utils.currencyToWords(Math.abs(spendSum), currency)} today`);
        else
          this.emit(':tell', `You haven't spent anything yet today!`);
      }
    );
  }).catch(utils.handleMonzoError.bind(this));
};
