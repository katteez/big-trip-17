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

  #tripContainer = null;
  #pointsContainer = null;

  init = (tripContainer, pointsContainer) => {
    this.#tripContainer = tripContainer;
    this.#pointsContainer = pointsContainer;

    render(new TripView(this.#points, this.#offers), this.#tripContainer, 'afterbegin');
    render(new SortView(), this.#pointsContainer);
    render(this.#pointListComponent, this.#pointsContainer);

    for(let i = 0; i< this.#points.length; i++) {
      // Получаем только те доп. опции, которые подходят под тип текущей точки маршрута
      const offersByPointType = this.#offers.find((offer) => offer.type === this.#points[i].type).offers;

      this.#renderPoints(offersByPointType, this.#points[i]);
    }
  };

  #renderPoints = (offersByPointType, point) => {
    const pointComponent = new PointView(offersByPointType, point);
    const pointEditComponent = new PointEditView(offersByPointType, point);

    const replacePointToForm = () => {
      this.#pointListComponent.element.replaceChild(pointEditComponent.element, pointComponent.element);
    };

    const replaceFormToPoint = () => {
      this.#pointListComponent.element.replaceChild(pointComponent.element, pointEditComponent.element);
    };

    pointComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
      replacePointToForm();
    });

    pointEditComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
      replaceFormToPoint();
    });

    render(pointComponent, this.#pointListComponent.element);
  };
}
