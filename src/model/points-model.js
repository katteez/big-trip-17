import { generatePoint } from '../mock/point.js';

export default class PointsModel {
  #destinations = null;
  #offers = null;

  constructor(allDestinations, offersByAllTypes) {
    this.#destinations = allDestinations;
    this.#offers = offersByAllTypes;
  }

  #points = () => Array.from({length: 10}, () => generatePoint(this.#destinations, this.#offers));

  get points() {
    return this.#points();
  }
}
