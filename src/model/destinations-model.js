import { generatedDestinations } from '../mock/destinations.js';

export default class DestinationsModel {
  #destinations = generatedDestinations;

  get destinations() {
    return this.#destinations;
  }
}
