import Observable from '../framework/observable.js';
import { UpdateType } from '../const.js';

export default class PointsModel extends Observable {
  #pointsApiService = null;
  #points = [];

  constructor(pointsApiService) {
    super();
    this.#pointsApiService = pointsApiService;
  }

  get points() {
    return this.#points;
  }

  init = async () => {
    try {
      const points = await this.#pointsApiService.points;
      this.#points = points.map(this.#adaptToClient);
    } catch(err) {
      this.#points = [];
    }

    this._notify(UpdateType.INIT);
  };

  updatePoint = async (updateType, update) => {
    const updatedPointIndex = this.#points.findIndex((point) => point.id === update.id);

    if (updatedPointIndex === -1) {
      throw new Error('Can\'t update non-existent point');
    }

    try {
      const response = await this.#pointsApiService.updatePoint(update);
      const updatedPoint = this.#adaptToClient(response);

      this.#points = [
        ...this.#points.slice(0, updatedPointIndex),
        updatedPoint,
        ...this.#points.slice(updatedPointIndex + 1),
      ];

      this._notify(updateType, updatedPoint);
    } catch(err) {
      throw new Error('Can\'t update point');
    }
  };

  addPoint = async (updateType, update) => {
    try {
      const response = await this.#pointsApiService.addPoint(update);
      const newPoint = this.#adaptToClient(response);

      this.#points = [newPoint, ...this.#points];
      this._notify(updateType, newPoint);
    } catch(err) {
      throw new Error('Can\'t add point');
    }
  };

  deletePoint = async (updateType, pointToDelete) => {
    try {
      await this.#pointsApiService.deletePoint(pointToDelete);

      this.#points = this.#points.filter((point) => point.id !== pointToDelete.id);
      this._notify(updateType);
    } catch(err) {
      throw new Error('Can\'t delete point');
    }
  };

  #adaptToClient = (point) => {
    const adaptedPoint = {...point,
      basePrice: point['base_price'],
      dateFrom: !point['date_from'] ? point['date_from'] : new Date(point['date_from']),
      dateTo: !point['date_to'] ? point['date_to'] : new Date(point['date_to']),
      isFavorite: point['is_favorite'],
    };

    delete adaptedPoint['base_price'];
    delete adaptedPoint['date_from'];
    delete adaptedPoint['date_to'];
    delete adaptedPoint['is_favorite'];

    return adaptedPoint;
  };
}
