import { RenderPosition, render, remove } from '../framework/render.js';
import PointsModel from '../model/points-model.js';
import OffersModel from '../model/offers-model.js';
import DestinationsModel from '../model/destinations-model.js';
import { generateFilter } from '../mock/filter.js';
import { FilterType, TextForNoPointView, SortType, UserAction, UpdateType } from '../const.js';
import FilterView from '../view/filter-view.js';
import TripView from '../view/trip-view.js';
import SortView from '../view/sort-view.js';
import PointListView from '../view/point-list-view.js';
import NoPointView from '../view/no-point-view.js';
import PointPresenter from './point-presenter.js';
import { sortDayUp, sortEventTypeUp, sortTimeDown, sortPriceDown } from '../utils/sort.js';

export default class PagePresenter {
  #tripContainer = null;
  #filterContainer = null;
  #pointListContainer = null;

  #pointsModel = new PointsModel();
  #offersModel = new OffersModel();
  #offers = [...this.#offersModel.offers];
  #destinationsModel = new DestinationsModel();
  #destinations = [...this.#destinationsModel.destinations];

  #currentSortType = SortType.DAY;
  #filters = generateFilter(this.points);
  #pointPresenterMap = new Map();

  #filterComponent = new FilterView(this.#filters);
  #pointListComponent = new PointListView();
  #noPointComponent = new NoPointView(TextForNoPointView[FilterType.EVERYTHING]);
  #tripComponent = null;
  #sortComponent = null;

  constructor(tripContainer, filterContainer, pointListContainer) {
    this.#tripContainer = tripContainer;
    this.#filterContainer = filterContainer;
    this.#pointListContainer = pointListContainer;

    this.#pointsModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    switch (this.#currentSortType) {
      case SortType.DAY:
        return [...this.#pointsModel.points].sort(sortDayUp);
      case SortType.EVENT:
        return [...this.#pointsModel.points].sort(sortEventTypeUp);
      case SortType.TIME:
        return [...this.#pointsModel.points].sort(sortTimeDown);
      case SortType.PRICE:
        return [...this.#pointsModel.points].sort(sortPriceDown);
    }

    return this.#pointsModel.points;
  }

  init = () => {
    this.#renderPage();
  };

  // 'Фильтры'
  #renderFilter = () => {
    render(this.#filterComponent, this.#filterContainer);
  };

  // 'Список точек маршрута'
  #renderPointList = () => {
    render(this.#pointListComponent, this.#pointListContainer);
  };

  // 'Отсутствие точек маршрута'
  #renderNoPoints = () => {
    render(this.#noPointComponent, this.#pointListComponent.element);
  };

  // 'Путешествие'
  #renderTrip = () => {
    this.#tripComponent = new TripView(this.points, this.#offers);
    render(this.#tripComponent, this.#tripContainer, RenderPosition.AFTERBEGIN);
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearPointList();
    this.#renderPoints();
  };

  // 'Сортировка'
  #renderSort = () => {
    this.#sortComponent = new SortView(Object.values(SortType), this.#currentSortType);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
    render(this.#sortComponent, this.#pointListComponent.element, RenderPosition.BEFOREBEGIN);
  };

  // Обновляем модель в зависимости от действий пользователя
  #handleViewAction = (actionType, updateType, updatedPoint) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsModel.updatePoint(updateType, updatedPoint);
        break;
      case UserAction.ADD_POINT:
        this.#pointsModel.addPoint(updateType, updatedPoint);
        break;
      case UserAction.DELETE_POINT:
        this.#pointsModel.deletePoint(updateType, updatedPoint);
        break;
    }
  };

  // Обработчик-наблюдатель, который реагирует на изменения модели точек маршрута
  #handleModelEvent = (updateType, updatedPoint) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenterMap.get(updatedPoint.id).init(updatedPoint);
        break;
      case UpdateType.MINOR:
        this.#clearPointList();
        this.#renderPoints();
        break;
      case UpdateType.MAJOR:
        this.#clearPage();
        this.#renderPage();
        break;
    }
  };

  // Закрываем все формы редактирования
  #handleModeChange = () => {
    this.#pointPresenterMap.forEach((presenter) => presenter.resetView());
  };

  // 'Точка маршрута'
  #renderPoint = (point, offersByAllTypes, allDestinations) => {
    const pointPresenter = new PointPresenter(this.#pointListComponent.element,
      offersByAllTypes, allDestinations, this.#handleViewAction, this.#handleModeChange);
    pointPresenter.init(point, this.#currentSortType);

    this.#pointPresenterMap.set(point.id, pointPresenter);
  };

  #renderPoints = () => {
    for (const point of this.points) {
      this.#renderPoint(point, this.#offers, this.#destinations);
    }
  };

  #clearPointList = () => {
    this.#pointPresenterMap.forEach((presenter) => presenter.destroy());
    this.#pointPresenterMap.clear();
  };

  #clearPage = () => {
    this.#clearPointList();

    remove(this.#filterComponent);
    remove(this.#noPointComponent);
    remove(this.#tripComponent);
    remove(this.#sortComponent);

    this.#currentSortType = SortType.DAY;
  };

  #renderPage = () => {
    this.#renderFilter();
    this.#renderPointList();

    if (!this.points.length) {
      this.#renderNoPoints();
      return;
    }

    this.#renderTrip();
    this.#renderSort();
    this.#renderPoints();
  };
}
