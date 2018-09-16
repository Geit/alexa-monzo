import request from 'request-promise';
import _ from 'underscore';
import moment from 'moment';

const utils = require('./utils');

function requestOptionsForRoute(path, token) {
  return {
    url: `https://api.getmondo.co.uk${path}`,
    json: true,
    auth: {
      bearer: token,
    },
  };
}

export default class MonzoUser {
  constructor(alexaRequest) {
    this.authToken = utils.getAndValidiateMonzoAuthToken(alexaRequest.requestEnvelope);
    this.attributes = alexaRequest.attributesManager.getSessionAttributes();
    this.CACHE_TIMEOUTS = {
      ACCOUNT: moment().subtract(2, 'minutes'),
      CARDS: moment().subtract(2, 'minutes'),
      // Not currently cached
      TARGETS: moment().subtract(10, 'minutes'),
      TRANSACTIONS: moment().subtract(2, 'minutes'),
    };
  }

  isValid() {
    return this.authToken;
  }

  getProfile() {
    const requestOptions = requestOptionsForRoute('/profile', this.authToken);
    return request(requestOptions);
  }

  getAccounts() {
    if (
      this.attributes &&
      this.attributes.accounts &&
      moment(this.attributes.accounts.lastFetch).isAfter(this.CACHE_TIMEOUTS.ACCOUNT)
    ) {
      return Promise.resolve(this.attributes.accounts.slice());
    }

    const requestOptions = _.extend(requestOptionsForRoute('/accounts', this.authToken), {
      transform2xxOnly: true,
      transform(body) {
        return body.accounts;
      },
    });
    return request(requestOptions).then(accounts => {
      accounts.lastFetch = moment().toString();
      // this.attributes.accounts = accounts;
      return accounts;
    });
  }

  getCards(accountId) {
    if (this.attributes.cards && moment(this.attributes.cards.lastFetch).isAfter(this.CACHE_TIMEOUTS.CARDS)) {
      return Promise.resolve(this.attributes.cards.slice());
    }

    const requestOptions = _.extend(requestOptionsForRoute('/card/list', this.authToken), {
      qs: { account_id: accountId },
      transform2xxOnly: true,
      transform(body) {
        return body.cards;
      },
    });
    return request(requestOptions).then(cards => {
      cards.lastFetch = moment().toString();
      this.attributes.cards = cards;
      return cards;
    });
  }

  setCardState(cardId, enabled) {
    const requestOptions = _.extend(requestOptionsForRoute('/card/toggle', this.authToken), {
      qs: {
        card_id: cardId,
        status: enabled ? 'ACTIVE' : 'INACTIVE',
      },
      method: 'PUT',
    });
    return request(requestOptions);
  }

  getBalance(accountId) {
    const requestOptions = _.extend(requestOptionsForRoute('/balance', this.authToken), {
      qs: { account_id: accountId },
    });
    return request(requestOptions);
  }

  getTargets(accountId) {
    const requestOptions = _.extend(requestOptionsForRoute('/targets', this.authToken), {
      qs: { account_id: accountId },
    });
    return request(requestOptions);
  }

  getTransactions(accountId, options) {
    const requestOptions = _.extend(requestOptionsForRoute('/transactions', this.authToken), {
      qs: {
        ...options,
        account_id: accountId,
      },
      transform2xxOnly: true,
      transform(body) {
        return body.transactions;
      },
    });
    return request(requestOptions);
  }
}
