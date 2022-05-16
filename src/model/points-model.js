import { generatePoint } from '../mock/point.js';

export default class PointsModel {
  #offers = null;

  constructor(offers) {
    this.#offers = offers;
  }

  #points = () => Array.from({length: 10}, () => generatePoint(this.#offers));

  get points() {
    return this.#points();
  }
}
