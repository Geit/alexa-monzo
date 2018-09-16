import MonzoUser from '../monzo';
import { translate as t } from '../translator';

export default {
  canHandle(handlerInput) {
    const { request } = handlerInput.requestEnvelope;

    return request.type === 'IntentRequest' && request.intent.name === 'FreezeCard';
  },

  async handle(handlerInput) {
    const { responseBuilder } = handlerInput;
    const monzoUser = new MonzoUser(handlerInput);

    if (!monzoUser.isValid()) return responseBuilder.getResponse();

    return responseBuilder.speak(t(this.locale, 'UnsupportedIntent')).getResponse();

    // const accounts = await monzoUser.getAccounts();

    // const cardsByAccount = await Promise.all(accounts.map(account => monzoUser.getCards(account.id)));

    // const freezeCard = card => monzoUser.setCardState(card.id, false);

    // await Promise.all(cardsByAccount.flat().map(freezeCard));

    // return responseBuilder.speak(t(this.locale, 'CardFrozen')).getResponse();
  },
};
