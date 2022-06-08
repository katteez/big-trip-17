import ApiService from './framework/api-service.js';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

export default class PointsApiService extends ApiService {
  get offers() {
    return this._load({url: 'offers'})
      .then(ApiService.parseResponse);
  }

  get destinations() {
    return this._load({url: 'destinations'})
      .then(ApiService.parseResponse);
  }

  get points() {
    return this._load({url: 'points'})
      .then(ApiService.parseResponse);
  }

  updatePoint = async (point) => this._load({
    url: `points/${point.id}`,
    method: Method.PUT,
    body: JSON.stringify(this.#adaptToServer(point)),
    headers: new Headers({'Content-Type': 'application/json'}),
  })
    .then(ApiService.parseResponse);

  addPoint = async (point) => this._load({
    url: 'points',
    method: Method.POST,
    body: JSON.stringify(this.#adaptToServer(point)),
    headers: new Headers({'Content-Type': 'application/json'}),
  })
    .then(ApiService.parseResponse);

  deletePoint = async (point) => this._load({
    url: `points/${point.id}`,
    method: Method.DELETE,
  });

  #adaptToServer = (point) => {
    const adaptedPoint = {...point,
      'base_price': point.basePrice,
      'date_from': point.dateFrom instanceof Date ? point.dateFrom.toISOString() : null,
      'date_to': point.dateTo instanceof Date ? point.dateTo.toISOString() : null,
      'is_favorite': point.isFavorite,
    };

    delete adaptedPoint.basePrice;
    delete adaptedPoint.dateFrom;
    delete adaptedPoint.dateTo;
    delete adaptedPoint.isFavorite;

    return adaptedPoint;
  };
}
