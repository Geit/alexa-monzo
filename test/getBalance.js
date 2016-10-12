/* eslint-env mocha */
require('chai').should();
const lambdaTester = require('./lambdaTester');
const nock = require('nock');

const accounts = [
  {
    'id': 'acc_0001',
    'created': '2016-10-05T10:00:00.000Z',
    'description': 'John Doe'
  },
  {
    'id': 'acc_0002',
    'created': '2016-10-05T10:00:00.000Z',
    'description': 'Mary Church'
  }
];

nock('https://api.getmondo.co.uk')
// The first time we get a list of accounts, return only the first one
.get('/accounts')
.once()
.reply(200, {
  'accounts': accounts.slice(0, 1)
})
// For the next account listing, return all
.get('/accounts')
.reply(200, {
  accounts
})
// Define the balances for both accounts
.get('/balance')
.twice()
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

describe('GetBalance', () => {
  describe('With a single account', () => {
    it('should return the users balance and primary account name', () => {
      return lambdaTester.testEchoIntent('GetBalance')
        .then((response) => {
          response.should.equal(`The balance for ${accounts[0].description}'s account is 50 pounds and 50 pence`);
        });
    });
  });
  describe('With multiple accounts', () => {
    it('should return the balances and account names of each account', () => {
      return lambdaTester.testEchoIntent('GetBalance')
        .then((response) => {
          response.should.equal(`You have ${accounts.length} accouts with Monzo, their balances are: ${accounts[0].description}'s account has a balance of 50 pounds and 50 pence. ${accounts[1].description}'s account has a balance of 60 pounds and 60 pence.`);
        });
    });
  });
});
