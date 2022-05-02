import { generateOffersByAllTypes } from '../mock/offers.js';

export default class OffersModel {
  offers = generateOffersByAllTypes();

  getOffers = () => this.offers;
}
