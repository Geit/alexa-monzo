'use strict';

const t = require('../translator').translate;

module.exports = function () {
  this.emit(':tell', t(this.locale, 'UnknownIntent'));
};
