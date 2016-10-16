'use strict';
const monzo = require('../monzo');
const utils = require('../utils');

module.exports = function () {
  const monzoUser = monzo.monzoUser(this);
  if (!monzoUser) return;

  monzoUser.getProfile().then((profile) => {
    if (!this.event.session.new)
      this.emit(':ask', `Your user number is ${profile.user_number}. Is there anything else you'd like to know?`, `You can ask me how much you've spent recently, or how you're doing with your targets.`);
    else
      this.emit(':tell', `Your user number is ${profile.user_number}`);
  }).catch(utils.handleMonzoError.bind(this));
};
