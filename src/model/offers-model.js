import { generatedOffersByAllTypes } from '../mock/offers.js';

export default class OffersModel {
  #offers = generatedOffersByAllTypes;

  get offers() {
    return this.#offers;
  }
}
