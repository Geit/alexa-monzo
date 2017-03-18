/* eslint-env mocha */
require('chai').should();
const lambdaTester = require('./lambdaTester');
const nock = require('nock');
const accounts = require('./accounts');

const monzoApi = nock('https://api.getmondo.co.uk');

describe('FreezeCard', () => {
  before(() => {
    nock.cleanAll();
    monzoApi
    .get('/accounts')
    .twice()
    .reply(200, {
      accounts: accounts.slice(0, 1)
    })
    .get('/card/list')
    .query({ account_id: 'acc_0001' })
    .reply(200, {
      cards: [
        {
          id: 'card_0000000001',
          processor_token: '123123123',
          processor: 'abc',
          account_id: 'acc_0001',
          last_digits: '0001',
          name: 'Peter Sherman',
          expires: '12/2020',
          status: 'ACTIVE'
        }
      ]
    })
    .put('/card/toggle')
    .query({ card_id: 'card_0000000001', status: 'INACTIVE' })
    .reply(200)
    .get('/card/list')
    .query({ account_id: 'acc_0001' })
    .reply(200, {
      cards: [
        {
          id: 'card_0000000001',
          processor_token: '123123123',
          processor: 'abc',
          account_id: 'acc_0001',
          last_digits: '0001',
          name: 'Peter Sherman',
          expires: '12/2020',
          status: 'INACTIVE'
        }
      ]
    });
  });
  it('should freeze the card', () => {
    return lambdaTester.testEchoIntent('FreezeCard')
      .then((response) => {
        response.should.equal(`Your Monzo card has been frozen.`);
      });
  });
  it('should tell me the card is already frozen', () => {
    return lambdaTester.testEchoIntent('FreezeCard')
      .then((response) => {
        response.should.equal(`Your Monzo card is already frozen.`);
      });
  });
});
