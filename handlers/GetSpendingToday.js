'use strict';

const monzo = require('../monzo');
const utils = require('../utils');
const async = require('async');
const t = require('../translator').translate;

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
          response = t(this.locale, 'SpendingToday', { amount: utils.currencyToWords(Math.abs(spendSum), currency) });
        else
          response = t(this.locale, 'NoSpendingToday');

        if (!this.event.session.new)
          this.emit(':ask', `${response} ${t(this.locale, 'ContinueSessionPrompt')}`, t(this.locale, 'Reprompt'));
        else
          this.emit(':tell', response);
      }
    );
  }).catch(utils.handleMonzoError.bind(this));
};
