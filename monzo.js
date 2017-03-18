'use strict';

const request = require('request-promise');
const _ = require('underscore');
const utils = require('./utils');
const moment = require('moment');

function requestOptionsForRoute (path, token) {
  return {
    url: `https://api.getmondo.co.uk${path}`,
    json: true,
    auth: {
      bearer: token
    }
  };
}

module.exports = {
  monzoUser (alexaRequest) {
    this.authToken = utils.getAndValidiateMonzoAuthToken(alexaRequest);
    if (!this.authToken) return null;

    // TODO Move to config file?
    const CACHE_TIMEOUTS = {
      ACCOUNT: moment().subtract(2, 'minutes'),
      CARDS: moment().subtract(2, 'minutes'),
      // Not currently cached
      TARGETS: moment().subtract(10, 'minutes'),
      TRANSACTIONS: moment().subtract(2, 'minutes')
    };

    this.getProfile = function () {
      const requestOptions = requestOptionsForRoute('/profile', this.authToken);
      return request(requestOptions);
    };

    this.getAccounts = function () {
      if (alexaRequest.attributes.accounts && moment(alexaRequest.attributes.accounts.lastFetch).isAfter(CACHE_TIMEOUTS.ACCOUNT))
        return new Promise((resolve, reject) => { resolve(alexaRequest.attributes.accounts.slice()); }); // Return a "copy" of the object

      const requestOptions = _.extend(
        requestOptionsForRoute('/accounts', this.authToken),
        {
          transform2xxOnly: true,
          transform (body, response, resolveWithFullResponse) {
            return body.accounts;
          }
        });
      return request(requestOptions).then((accounts) => {
        accounts.lastFetch = moment().toString();
        alexaRequest.attributes.accounts = accounts;
        return accounts;
      });
    };

    this.getCards = function (accountId) {
      if (alexaRequest.attributes.cards && moment(alexaRequest.attributes.cards.lastFetch).isAfter(CACHE_TIMEOUTS.CARDS))
        return new Promise((resolve, reject) => { resolve(alexaRequest.attributes.cards.slice()); });

      const requestOptions = _.extend(
        requestOptionsForRoute('/card/list', this.authToken),
        {
          qs: { account_id: accountId },
          transform2xxOnly: true,
          transform (body, response, resolveWithFullResponse) {
            return body.cards;
          }
        });
      return request(requestOptions).then((cards) => {
        cards.lastFetch = moment().toString();
        alexaRequest.attributes.cards = cards;
        return cards;
      });
    };

    this.setCardState = function (cardId, enabled) {
      const requestOptions = _.extend(
        requestOptionsForRoute('/card/toggle', this.authToken),
        {
          qs: {
            card_id: cardId,
            status: enabled ? 'ACTIVE' : 'INACTIVE'
          },
          method: 'PUT'
        });
      return request(requestOptions);
    };

    this.getBalance = function (accountId) {
      const requestOptions = _.extend(
        requestOptionsForRoute('/balance', this.authToken),
        {
          qs: { account_id: accountId }
        });
      return request(requestOptions);
    };

    this.getTargets = function (accountId) {
      const requestOptions = _.extend(
        requestOptionsForRoute('/targets', this.authToken),
        {
          qs: { account_id: accountId }
        });
      return request(requestOptions);
    };

    this.getTransactions = function (accountId, options) {
      options = _.extend(options, { account_id: accountId });

      const requestOptions = _.extend(
        requestOptionsForRoute('/transactions', this.authToken),
        {
          qs: options,
          transform2xxOnly: true,
          transform (body, response, resolveWithFullResponse) {
            return body.transactions;
          }
        });
      return request(requestOptions);
    };

    return this;
  }
};
