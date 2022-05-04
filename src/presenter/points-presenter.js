import OffersModel from '../model/offers-model.js';
import PointsModel from '../model/points-model.js';
import TripView from '../view/trip-view.js';
import SortView from '../view/sort-view.js';
import PointListView from '../view/point-list-view.js';
import PointEditView from '../view/point-edit-view.js';
import PointView from '../view/point-view.js';
import { render } from '../render.js';

export default class PointsPresenter {
  #pointListComponent = new PointListView();
  #offersModel = new OffersModel();
  #offers = [...this.#offersModel.offers];
  #pointsModel = new PointsModel(this.#offers);
  #points = [...this.#pointsModel.points];
  #point = this.#points[0]; // временно работаем только с первой точкой маршрута из массива точек

  #tripContainer = null;
  #pointsContainer = null;
  #offersByPointType  = null;

  init = (tripContainer, pointsContainer) => {
    this.#tripContainer = tripContainer;
    this.#pointsContainer = pointsContainer;

    // Получаем только те доп. опции, которые подходят под тип текущей точки маршрута
    this.#offersByPointType = this.#offers.find((offer) => offer.type === this.#point.type).offers;

    render(new TripView(this.#points, this.#offers), this.#tripContainer, 'afterbegin');
    render(new SortView(), this.#pointsContainer);
    render(this.#pointListComponent, this.#pointsContainer);
    render(new PointEditView(this.#offersByPointType, this.#point), this.#pointListComponent.element); // редактирование точки маршрута
    render(new PointEditView(this.#offersByPointType), this.#pointListComponent.element); // добавление новой точки маршрута

    for(let i = 0; i< this.#points.length; i++) {
      // Получаем только те доп. опции, которые подходят под тип текущей точки маршрута
      const offersByPointType = this.#offers.find((offer) => offer.type === this.#points[i].type).offers;

      render(new PointView(this.#points[i], offersByPointType), this.#pointListComponent.element);
    }
  };
}
