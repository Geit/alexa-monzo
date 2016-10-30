'use strict';
const monzo = require('../monzo');

module.exports = function () {
  const monzoUser = monzo.monzoUser(this);
  if (!monzoUser) return;

  monzoUser.getAccounts().then((accounts) => {
    monzoUser.getCards(accounts[0].id).then((cards) => {
      if (cards[0].status === 'INACTIVE') {
        monzoUser.setCardState(cards[0].id, true).then(() => {
          if (!this.event.session.new)
            this.emit(':ask', `Your Monzo card has been unfrozen. Is there anything else I can help with?`);
          else
            this.emit(':tell', `Your Monzo card has been unfrozen`);
        });
      } else {
        if (!this.event.session.new)
          this.emit(':ask', `Your Monzo card isn't frozen. Is there anything else I can help with?`);
        else
          this.emit(':tell', `Your Monzo card isn't frozen`);
      }
    });
  });
};
