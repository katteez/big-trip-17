import { generatePoint } from '../mock/point.js';

export default class PointsModel {
  #offers = null;

  constructor(offers) {
    this.#offers = offers;
  }

  // Получаем точки и сортируем их в порядке возрастания даты начала
  #points = () => Array.from({length: 3}, () => generatePoint(this.#offers)).sort((a, b) => a.dateFrom - b.dateFrom);

  get points() {
    return this.#points();
  }
}