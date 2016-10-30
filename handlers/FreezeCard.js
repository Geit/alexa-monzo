'use strict';
const monzo = require('../monzo');

module.exports = function () {
  const monzoUser = monzo.monzoUser(this);
  if (!monzoUser) return;

  monzoUser.getAccounts().then((accounts) => {
    monzoUser.getCards(accounts[0].id).then((cards) => {
      if (cards[0].status === 'ACTIVE') {
        monzoUser.setCardState(cards[0].id, false).then(() => {
          if (!this.event.session.new)
            this.emit(':ask', `Your Monzo card has been frozen. Is there anything else I can help with?`);
          else
            this.emit(':tell', `Your Monzo card has been frozen`);
        });
      } else {
        if (!this.event.session.new)
          this.emit(':ask', `Your Monzo card is already frozen. Is there anything else I can help with?`);
        else
          this.emit(':tell', `Your Monzo card is already frozen`);
      }
    });
  });
};
