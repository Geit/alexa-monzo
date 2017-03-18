'use strict';

const monzo = require('../monzo');
const _ = require('underscore');
const utils = require('../utils');
const t = require('../translator').translate;

module.exports = function () {
  const monzoUser = monzo.monzoUser(this);
  if (!monzoUser) return;

  monzoUser.getAccounts().then((accounts) => {
    monzoUser.getTargets(accounts[0].id).then((targets) => {
      if (!targets.targets.length) {
        if (!this.event.session.new)
          return this.emit(':ask', `You don't have any targets, Set some up in the Monzo App! ${t(this.locale, 'ContinueSessionPrompt')}`, t(this.locale, 'Reprompt'));
        else
          return this.emit(':tell', `You don't have any targets, Set some up in the Monzo App!`);
      }

      // TODO maybe give special treatment to the "total" target
      const targetBuckets = _.groupBy(targets.targets, 'status');
      if (targetBuckets.OKAY && targetBuckets.OKAY.length === targets.targets.length) {
        this.emit(':tell', `You're currently within all your targets for this ${targets.interval_type}`);
      } else {
        const responseParts = [];
        if (targetBuckets.EXCEEDED)
          responseParts.push(`You've exceeded your target for the following categories: ${utils.properEnglishJoin(_.pluck(targetBuckets.EXCEEDED, 'name')).replace('_', ' ')}.`);

        if (targetBuckets.WARNING)
          responseParts.push(`You're close to exceeding your target for these categories: ${utils.properEnglishJoin(_.pluck(targetBuckets.WARNING, 'name')).replace('_', ' ')}.`);

        if (targetBuckets.OKAY) {
          if (targetBuckets.WARNING || targetBuckets.EXCEEDED)
            responseParts.push(`But don't worry,`);
          responseParts.push(`You're still on target for the following categories: ${utils.properEnglishJoin(_.pluck(targetBuckets.OKAY, 'name')).replace('_', ' ')}`);
        }
        if (!this.event.session.new)
          this.emit(':ask', `${responseParts.join(' ')}. ${t(this.locale, 'ContinueSessionPrompt')}`, t(this.locale, 'Reprompt'));
        else
          this.emit(':tell', responseParts.join(' '));
      }
    });
  }).catch(utils.handleMonzoError.bind(this));
};
