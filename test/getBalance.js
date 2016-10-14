/* eslint-env mocha */
require('chai').should();
const lambdaTester = require('./lambdaTester');
const nock = require('nock');

const accounts = require('./accounts');
const monzoApi = nock('https://api.getmondo.co.uk');

describe('GetBalance', () => {
  before(() => {
    nock.cleanAll();
  });
  describe('With a single account', () => {
    before(() => {
      monzoApi
        .get('/accounts')
        .reply(200, {
          'accounts': accounts.slice(0, 1)
        })
        .get('/balance')
        .query({account_id: 'acc_0001'})
        .reply(200, {
          'balance': 5050,
          'currency': 'GBP',
          'spend_today': 0,
          'local_currency': '',
          'local_exchange_rate': 0,
          'local_spend': []
        });
    });
    it('should return the users balance and primary account name', () => {
      return lambdaTester.testEchoIntent('GetBalance')
        .then((response) => {
          response.should.equal(`The balance for ${accounts[0].description}'s account is 50 pounds and 50 pence`);
        });
    });
  });
  describe('With multiple accounts', () => {
    before(() => {
      monzoApi
      .get('/accounts')
      .reply(200, {
        accounts
      })
      .get('/balance')
      .query({account_id: 'acc_0001'})
      .reply(200, {
        'balance': 5050,
        'currency': 'GBP',
        'spend_today': 0,
        'local_currency': '',
        'local_exchange_rate': 0,
        'local_spend': []
      })
      .get('/balance')
      .query({account_id: 'acc_0002'})
      .reply(200, {
        'balance': 6060,
        'currency': 'GBP',
        'spend_today': 0,
        'local_currency': '',
        'local_exchange_rate': 0,
        'local_spend': []
      });
    });
    it('should return the balances and account names of each account', () => {
      return lambdaTester.testEchoIntent('GetBalance')
        .then((response) => {
          response.should.equal(`You have ${accounts.length} accouts with Monzo, their balances are: ${accounts[0].description}'s account has a balance of 50 pounds and 50 pence. ${accounts[1].description}'s account has a balance of 60 pounds and 60 pence.`);
        });
    });
  });
});
