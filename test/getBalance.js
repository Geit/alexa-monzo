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
          accounts: accounts.slice(0, 1)
        })
        .get('/balance')
        .query({ account_id: 'acc_0001' })
        .reply(200, {
          balance: 5050,
          currency: 'GBP',
          spend_today: 0,
          local_currency: '',
          local_exchange_rate: 0,
          local_spend: []
        });
    });
    it('should return the users balance and primary account name', () => {
      return lambdaTester.testEchoIntent('GetBalance')
        .then((response) => {
          response.should.equal(`The balance for ${accounts[0].description}'s account is 50 pounds and 50 pence.`);
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
      .query({ account_id: 'acc_0001' })
      .reply(200, {
        balance: 5050,
        currency: 'GBP',
        spend_today: 0,
        local_currency: '',
        local_exchange_rate: 0,
        local_spend: []
      })
      .get('/balance')
      .query({ account_id: 'acc_0002' })
      .reply(200, {
        balance: 6060,
        currency: 'GBP',
        spend_today: 0,
        local_currency: '',
        local_exchange_rate: 0,
        local_spend: []
      });
    });
    it('should return the balances and account names of each account', () => {
      return lambdaTester.testEchoIntent('GetBalance')
        .then((response) => {
          response.should.equal(`You have ${accounts.length} accounts with Monzo, their balances are: ${accounts[0].description}'s account has a balance of 50 pounds and 50 pence. ${accounts[1].description}'s account has a balance of 60 pounds and 60 pence.`);
        });
    });
  });
  describe('With no access token', () => {
    it('should return an error indicating the user should sign up', () => {
      return lambdaTester.testEchoIntent('GetBalance', null, true)
      .then((response) => {
        response.should.equal('Please link your Monzo account in the Alexa App first');
      });
    });
  });
  describe('With invalid access token', () => {
    before(() => {
      monzoApi
        .get('/accounts')
        .reply(401, {
          code: 'unauthorized.bad_access_token'
        });
    });
    it('should return an error indicating the user should regenerate their token', () => {
      return lambdaTester.testEchoIntent('GetBalance', null)
      .then((response) => {
        response.should.equal('Your Monzo access token appears to be invalid, please regenerate it');
      });
    });
  });
});
