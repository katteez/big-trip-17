import { RenderPosition, render } from '../framework/render.js';
import TripView from '../view/trip-view.js';
import SortView from '../view/sort-view.js';
import PointListView from '../view/point-list-view.js';
import NoPointView from '../view/no-point-view.js';
import { FilterType, TextForNoPointView, SortType } from '../const.js';
import PointPresenter from './point-presenter.js';
import { updateItemInArray } from '../utils/common.js';
import { findOffersByType } from '../utils/point.js';
import { sortDayUp, sortEventTypeUp, sortTimeDown, sortPriceDown } from '../utils/sort.js';

export default class PagePresenter {
  #tripContainer = null;
  #pointsContainer = null;
  #offers = null;
  #points = null;

  #pointListComponent = new PointListView();
  #noPointComponent = new NoPointView(TextForNoPointView[FilterType.EVERYTHING]);
  #sortComponent = new SortView(Object.values(SortType));

  #pointPresenterMap = new Map();
  #currentSortType = SortType.DAY;

  constructor(tripContainer, pointsContainer, offers, points) {
    this.#tripContainer = tripContainer;
    this.#pointsContainer = pointsContainer;
    this.#offers = offers;
    this.#points = points;
  }

  init = () => {
    this.#points.sort(sortDayUp);
    this.#renderPage();
  };

  #renderNoPoints = () => {
    render(this.#noPointComponent, this.#pointListComponent.element);
  };

  #renderTrip = () => {
    render(new TripView(this.#points, this.#offers), this.#tripContainer, RenderPosition.AFTERBEGIN);
  };

  #sortPoints = (sortType) => {
    switch (sortType) {
      case SortType.DAY:
        this.#points.sort(sortDayUp);
        break;
      case SortType.EVENT:
        this.#points.sort(sortEventTypeUp);
        break;
      case SortType.TIME:
        this.#points.sort(sortTimeDown);
        break;
      case SortType.PRICE:
        this.#points.sort(sortPriceDown);
        break;
    }

    this.#currentSortType = sortType;
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortPoints(sortType);
    this.#clearPointList();
    this.#renderPoints();
  };

  #renderSort = () => {
    render(this.#sortComponent, this.#pointListComponent.element, RenderPosition.BEFOREBEGIN);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  };

  // Обновляем данные и представление точки маршрута
  #handlePointChange = (updatedPoint) => {
    updateItemInArray(this.#points, updatedPoint);
    this.#pointPresenterMap.get(updatedPoint.id).init(updatedPoint);
  };

  // Закрываем все формы редактирования
  #handleModeChange = () => {
    this.#pointPresenterMap.forEach((presenter) => presenter.resetView());
  };

  #renderPoint = (point, offersByPointType) => {
    const pointPresenter = new PointPresenter(this.#pointListComponent.element, this.#handlePointChange, this.#handleModeChange);
    pointPresenter.init(point, offersByPointType);

    this.#pointPresenterMap.set(point.id, pointPresenter);
  };

  #renderPoints = () => {
    for (const point of this.#points) {
      const offersByType = findOffersByType(this.#offers, point.type);

      this.#renderPoint(point, offersByType);
    }
  };

  #clearPointList = () => {
    this.#pointPresenterMap.forEach((presenter) => presenter.destroy());
    this.#pointPresenterMap.clear();
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
