import { generateOffersByAllTypes } from '../mock/offers.js';

export default class OffersModel {
  #offers = generateOffersByAllTypes();

  get offers() {
    return this.#offers;
  }
}
