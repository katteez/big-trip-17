import { generatePoint } from '../mock/point.js';

export default class PointsModel {
  points = Array.from({length: 3}, generatePoint);

  getPoints = () => {
    this.points.sort((a, b) => a.dateFrom - b.dateFrom); // сортируем в порядке возрастания даты начала

    return this.points;
  };
}
