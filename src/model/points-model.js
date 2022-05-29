import Observable from '../framework/observable.js';
import { generatePoint } from '../mock/point.js';

export default class PointsModel extends Observable {
  #points = Array.from({length: 10}, generatePoint);

  get points() {
    return this.#points;
  }

  updatePoint = (updateType, updatedPoint) => {
    const updatedPointIndex = this.#points.findIndex((point) => point.id === updatedPoint.id);

    if (updatedPointIndex === -1) {
      throw new Error('Can\'t update non-existent point');
    }

    this.#points = [
      ...this.#points.slice(0, updatedPointIndex),
      updatedPoint,
      ...this.#points.slice(updatedPointIndex + 1),
    ];

    this._notify(updateType, updatedPoint);
  };

  addPoint = (updateType, updatedPoint) => {
    this.#points = [
      updatedPoint,
      ...this.#points,
    ];

    this._notify(updateType, updatedPoint);
  };

  deletePoint = (updateType, pointToDelete) => {
    const pointToDeleteIndex = this.#points.findIndex((point) => point.id === pointToDelete.id);

    if (pointToDeleteIndex === -1) {
      throw new Error('Can\'t delete non-existent point');
    }

    this.#points = [
      ...this.#points.slice(0, pointToDeleteIndex),
      ...this.#points.slice(pointToDeleteIndex + 1),
    ];

    this._notify(updateType);
  };
}
