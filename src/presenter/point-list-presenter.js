import { RenderPosition, render } from '../framework/render.js';
import TripView from '../view/trip-view.js';
import SortView from '../view/sort-view.js';
import PointListView from '../view/point-list-view.js';
import NoPointView from '../view/no-point-view.js';
import { FilterType, TextForNoPointView, SortType } from '../const.js';
import PointPresenter from './point-presenter.js';

export default class PointListPresenter {
  #tripContainer = null;
  #pointsContainer = null;
  #offers = null;
  #points = null;

  #pointListComponent = new PointListView();
  #noPointComponent = new NoPointView(TextForNoPointView[FilterType.EVERYTHING]);
  #sortComponent = new SortView(Object.values(SortType));

  constructor(tripContainer, pointsContainer, offers, points) {
    this.#tripContainer = tripContainer;
    this.#pointsContainer = pointsContainer;
    this.#offers = offers;
    this.#points = points;
  }

  init = () => {
    this.#renderPage();
  };

  #renderNoPoints = () => {
    render(this.#noPointComponent, this.#pointListComponent.element);
  };

  #renderTrip = () => {
    render(new TripView(this.#points, this.#offers), this.#tripContainer, RenderPosition.AFTERBEGIN);
  };

  #renderSort = () => {
    render(this.#sortComponent, this.#pointListComponent.element, RenderPosition.BEFOREBEGIN);
  };

  #renderPoint = (point, offersByPointType) => {
    const pointPresenter = new PointPresenter(this.#pointListComponent.element);
    pointPresenter.init(point, offersByPointType);
  };

  #renderPoints = () => {
    for (const point of this.#points) {
      // Получаем только те доп. опции, которые подходят под тип текущей точки маршрута
      const offersByPointType = this.#offers.find((offer) => offer.type === point.type).offers;

      this.#renderPoint(point, offersByPointType);
    }
  };

  #renderPage = () => {
    render(this.#pointListComponent, this.#pointsContainer);

    if (!this.#points.length) {
      this.#renderNoPoints();
      return;
    }

    this.#renderTrip();
    this.#renderSort();
    this.#renderPoints();
  };
}
