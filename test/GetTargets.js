/* eslint-env mocha */
require('chai').should();
const lambdaTester = require('./lambdaTester');
const nock = require('nock');
const accounts = require('./accounts');
const monzoApi = nock('https://api.getmondo.co.uk');

describe('GetTargets', () => {
  before(() => {
    nock.cleanAll();
  });

  describe('With no targets', () => {
    before(() => {
      monzoApi
        .get('/accounts')
        .reply(200, {
          accounts: accounts.slice(0, 1)
        })
        .get('/targets')
        .query({ account_id: accounts[0].id })
        .reply(200, {
          interval_type: 'month',
          interval: {
            start: '2016-09-30T23:00:00Z',
            end: '2016-10-31T23:59:59.999Z'
          },
          currency: 'GBP',
          targets: []
        });
    });
    it('should a no spending message', () => {
      return lambdaTester.testEchoIntent('GetTargets')
        .then((response) => {
          response.should.equal(`You don't have any targets, Set some up in the Monzo App!`);
        });
    });
  });

  describe('With various targets', () => {
    before(() => {
      monzoApi
        .get('/accounts')
        .reply(200, {
          accounts: accounts.slice(0, 1)
        })
        .get('/targets')
        .query({ account_id: accounts[0].id })
        .reply(200, {
          interval_type: 'month',
          interval: {
            start: '2016-09-30T23:00:00Z',
            end: '2016-10-31T23:59:59.999Z'
          },
          currency: 'GBP',
          targets: [
            {
              type: 'category',
              name: 'expenses',
              amount: 5500,
              status: 'WARNING'
            },
            {
              type: 'category',
              name: 'general',
              amount: 10400,
              status: 'WARNING'
            },
            {
              type: 'category',
              name: 'groceries',
              amount: 21000,
              status: 'OKAY'
            },
            {
              type: 'total',
              name: 'total',
              amount: 130000,
              status: 'OKAY'
            },
            {
              type: 'category',
              name: 'eating_out',
              amount: 42700,
              status: 'OKAY'
            },
            {
              type: 'category',
              name: 'entertainment',
              amount: 43700,
              status: 'OKAY'
            }
          ]
        });
    });
    it('should a no spending message', () => {
      return lambdaTester.testEchoIntent('GetTargets')
        .then((response) => {
          response.should.equal(`You're close to exceeding your target for these categories: expenses, and general. But don't worry, You're still on target for the following categories: groceries, total, eating out, and entertainment`);
        });
    });
  });
});
