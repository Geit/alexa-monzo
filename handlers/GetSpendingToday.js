'use strict';
const monzo = require('../monzo');
const utils = require('../utils');
const async = require('async');

module.exports = function () {
  const monzoUser = monzo.monzoUser(this);
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
        let response = '';
        if (spendSum < 0)
          response = `You've spent a total of ${utils.currencyToWords(Math.abs(spendSum), currency)} today.`;
        else
          response = `You haven't spent anything yet today!`;

        if (!this.event.session.new)
          this.emit(':ask', `${response} Was there anything else I can help you with?`, `You can ask me how much you've spent recently, or how you're doing with your targets.`);
        else
          this.emit(':tell', response);
      }
    );
  }).catch(utils.handleMonzoError.bind(this));
};
