/* eslint-env mocha */
require('chai').should();
const lambdaTester = require('./lambdaTester');
const nock = require('nock');
const accounts = require('./accounts');
const monzoApi = nock('https://api.getmondo.co.uk');

describe('GetSpendingToday', () => {
  before(() => {
    nock.cleanAll();
  });
  describe('With a single account, with no spending', () => {
    before(() => {
      monzoApi
        .get('/accounts')
        .reply(200, {
          accounts: accounts.slice(0, 1)
        })
        .get('/balance')
        .once()
        .query({ account_id: accounts[0].id })
        .reply(200, {
          balance: 5050,
          currency: 'GBP',
          spend_today: 0,
          local_currency: '',
          local_exchange_rate: 0,
          local_spend: []
        });
    });
    it('should a no spending message', () => {
      return lambdaTester.testEchoIntent('GetSpendingToday')
        .then((response) => {
          response.should.equal(`You haven't spent anything yet today!`);
        });
    });
  });

  describe('With a single account, with balance', () => {
    before(() => {
      monzoApi
          .get('/accounts')
          .reply(200, {
            accounts: accounts.slice(0, 1)
          })
          .get('/balance')
          .query({ account_id: accounts[0].id })
          .twice()
          .reply(200, {
            balance: 5050,
            currency: 'GBP',
            spend_today: -10450,
            local_currency: '',
            local_exchange_rate: 0,
            local_spend: []
          });
    });
    it('should return the single accounts spending', () => {
      return lambdaTester.testEchoIntent('GetSpendingToday')
        .then((response) => {
          response.should.equal(`You've spent a total of 104 pounds and 50 pence today.`);
        });
    });
  });
  describe('With multiple accounts, both with balance', () => {
    before(() => {
      monzoApi
        .get('/accounts')
        .reply(200, {
          accounts
        })
        .get('/balance')
        .query({ account_id: accounts[1].id })
        .reply(200, {
          balance: 6060,
          currency: 'GBP',
          spend_today: -1231,
          local_currency: '',
          local_exchange_rate: 0,
          local_spend: []
        });
    });
    it('should sum up the spending of both accounts', () => {
      return lambdaTester.testEchoIntent('GetSpendingToday')
        .then((response) => {
          response.should.equal(`You've spent a total of 116 pounds and 81 pence today.`);
        });
    });
  });
});
