/* eslint-env mocha */
require('chai').should();
const lambdaTester = require('./lambdaTester');
const nock = require('nock');
nock.cleanAll();
const accounts = require('./accounts');
const monzoApi = nock('https://api.getmondo.co.uk');

describe('GetSpendingHistory', () => {
  before(() => {
    nock.cleanAll();
    monzoApi
    .persist()
    // The first time we get a list of accounts, return only the first one
    .get('/accounts')
    .reply(200, {
      accounts: accounts.slice(0, 1)
    });
  });
  describe('With a time frame of 1 month, filtered to groceries', () => {
    before(() => {
      monzoApi
      .get('/transactions')
      .query({ account_id: accounts[0].id, since: /.*/ })
      .once()
      .reply(200, {
        transactions: [
          {
            amount: -185,
            category: 'groceries'
          },
          // A refund?
          {
            amount: 2000,
            category: 'groceries'
          },
          {
            amount: -300,
            category: 'groceries'
          },
          {
            amount: -1655,
            category: 'groceries'
          },
          {
            amount: -7715,
            attachments: [],
            category: 'transport'
          },
          {
            amount: -300,
            category: 'groceries'
          }
        ]
      });
    });
    it('should a no spending message', () => {
      return lambdaTester.testEchoIntent('GetSpendingHistory', {
        duration: {
          name: 'duration',
          value: 'P1M'
        },
        TransactionCategory: {
          name: 'TransactionCategory',
          value: 'groceries'
        } })
        .then((response) => {
          response.should.equal(`You've spent a total of 24 pounds and 40 pence on groceries in the last month.`);
        });
    });
  });
});
