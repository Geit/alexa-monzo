/* eslint-env mocha */
require('chai').should();
const lambdaTester = require('./lambdaTester');
const nock = require('nock');

const monzoApi = nock('https://api.getmondo.co.uk');

describe('GetUserNumber', () => {
  before(() => {
    nock.cleanAll();
    monzoApi
    .get('/profile')
    .reply(200, {
      address: {
        administrative_area: '',
        country: 'GBR',
        formatted_address: '',
        locality: 'Sydney',
        postal_code: 'SD011AE',
        street_address: [
          '42 Wallaby Way',
          'Sydney'
        ]
      },
      date_of_birth: '1974-02-22',
      email: 'p.sherman@example.com',
      name: 'Peter Sherman',
      phone_number: '+4400000000',
      user_id: 'user_00001',
      user_number: 123
    });
  });
  it('should print the user number', () => {
    return lambdaTester.testEchoIntent('GetUserNumber')
      .then((response) => {
        response.should.equal(`Your user number is 123.`);
      });
  });
});
