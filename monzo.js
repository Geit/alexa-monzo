'use strict';
const request = require('request-promise');
const _ = require('underscore');

// TODO make into class initialized by auth token?
module.exports = {
  monzoUser (authToken) {
    if (!authToken) return null;
    this.authToken = authToken;

    this.getProfile = function () {
      const requestOptions = requestOptionsForRoute('/profile', this.authToken);
      return request(requestOptions);
    };

    this.getAccounts = function () {
      const requestOptions = _.extend(
        requestOptionsForRoute('/accounts', this.authToken),
        {
          transform2xxOnly: true,
          transform (body, response, resolveWithFullResponse) {
            return body.accounts;
          }
        });
      return request(requestOptions);
    };

    this.getBalance = function (accountId) {
      const requestOptions = _.extend(
        requestOptionsForRoute('/balance', this.authToken),
        {
          qs: {'account_id': accountId}
        });
      return request(requestOptions);
    };

    this.getTargets = function (accountId) {
      const requestOptions = _.extend(
        requestOptionsForRoute('/targets', this.authToken),
        {
          qs: {'account_id': accountId}
        });
      return request(requestOptions);
    };

    this.getTransactions = function (accountId, options) {
      options = _.extend(options, {'account_id': accountId});

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

function requestOptionsForRoute (path, token) {
  return {
    url: `https://api.getmondo.co.uk${path}`,
    json: true,
    auth: {
      bearer: token
    }
  };
}
