'use strict';
const monzo = require('../monzo');

module.exports = function () {
  const monzoUser = monzo.monzoUser(this);
  if (!monzoUser) return;

  // This forces the accounts to be cached on the user's next request
  monzoUser.getAccounts().then((accounts) => {
    this.emit(':ask', 'Welcome to Monzo! What can I help you with today?', 'You can ask me things like "how much is my balance?" or "How much have I spent in the last week"');
  });
};
