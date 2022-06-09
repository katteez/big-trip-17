import { RenderPosition, render, remove } from '../framework/render.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import PointsApiService from '../points-api-service.js';
import OffersModel from '../model/offers-model.js';
import DestinationsModel from '../model/destinations-model.js';
import PointsModel from '../model/points-model.js';
import FilterModel from '../model/filter-model.js';
import { FilterType, SortType, UserAction, UpdateType } from '../const.js';
import LoadingView from '../view/loading-view.js';
import NewPointButtonView from '../view/new-point-button-view.js';
import PointListView from '../view/point-list-view.js';
import NoPointView from '../view/no-point-view.js';
import TripView from '../view/trip-view.js';
import SortView from '../view/sort-view.js';
import FilterPresenter from './filter-presenter.js';
import PointPresenter from './point-presenter.js';
import PointNewPresenter from './point-new-presenter.js';
import { filter } from '../utils/filter.js';
import { sortDayUp, sortEventTypeUp, sortTimeDown, sortPriceDown } from '../utils/sort.js';

const UiBlockerTimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

export default class PagePresenter {
  #tripContainer = null;
  #filterContainer = null;
  #pointListContainer = null;
  #endPoint = null;
  #authorization = null;

  #pointsApiService = null;
  #offersModel = null;
  #offers = null;
  #destinationsModel = null;
  #destinations = null;
  #pointsModel = null;
  #filterModel = new FilterModel();

  #isLoading = true;
  #filterType = FilterType.EVERYTHING;
  #currentSortType = SortType.DAY;
  #pointPresenterMap = new Map();
  #pointNewPresenter = null;
  #uiBlocker = new UiBlocker(UiBlockerTimeLimit.LOWER_LIMIT, UiBlockerTimeLimit.UPPER_LIMIT);

  #loadingComponent = new LoadingView();
  #newPointButtonComponent = null;
  #noPointComponent = null;
  #pointListComponent = new PointListView();
  #tripComponent = null;
  #sortComponent = null;

  constructor(tripContainer, filterContainer, pointListContainer, endPoint, authorization) {
    this.#tripContainer = tripContainer;
    this.#filterContainer = filterContainer;
    this.#pointListContainer = pointListContainer;
    this.#endPoint = endPoint;
    this.#authorization = authorization;

    this.#pointsApiService = new PointsApiService(this.#endPoint, this.#authorization);

    this.#offersModel = new OffersModel(this.#pointsApiService);
    this.#destinationsModel = new DestinationsModel(this.#pointsApiService);
    this.#pointsModel = new PointsModel(this.#pointsApiService);

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    this.#filterType = this.#filterModel.filter;
    const points = this.#pointsModel.points;
    const filteredPoints = filter[this.#filterType](points);

    switch (this.#currentSortType) {
      case SortType.DAY:
        return filteredPoints.sort(sortDayUp);
      case SortType.EVENT:
        return filteredPoints.sort(sortEventTypeUp);
      case SortType.TIME:
        return filteredPoints.sort(sortTimeDown);
      case SortType.PRICE:
        return filteredPoints.sort(sortPriceDown);
    }

    return filteredPoints;
  }

  init = () => {
    this.#loadData().finally(() => {
      this.#pointNewPresenter = new PointNewPresenter(this.#destinations, this.#offers,
        this.#pointListComponent.element, this.#handleViewAction);

      const filterPresenter = new FilterPresenter(this.#filterContainer, this.#filterModel, this.#pointsModel);
      filterPresenter.init();

      this.#renderPage({rerenderNewPointButton: true});
    });
  };

  #loadData = async () => {
    await this.#offersModel.init();
    this.#offers = [...this.#offersModel.offers];

    await this.#destinationsModel.init();
    this.#destinations = [...this.#destinationsModel.destinations];

    this.#pointsModel.init();
  };

  #createPoint = (callback) => {
    this.#currentSortType = SortType.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#pointNewPresenter.init(callback);
  };

  #handleNewPointFormClose = () => {
    this.#newPointButtonComponent.element.disabled = false;
  };

  #handleNewPointButtonClick = () => {
    this.#newPointButtonComponent.element.disabled = true;
    this.#createPoint(this.#handleNewPointFormClose);
  };

  // 'Кнопка создания новой точки'
  #renderNewPointButton = () => {
    this.#newPointButtonComponent = new NewPointButtonView(this.#isLoading);
    this.#newPointButtonComponent.setClickHandler(this.#handleNewPointButtonClick);
    render(this.#newPointButtonComponent, this.#tripContainer);
  };

  // 'Заглушка, пока грузятся данные'
  #renderLoading = () => {
    render(this.#loadingComponent, this.#pointListContainer);
  };

  // 'Отсутствие точек маршрута'
  #renderNoPoints = () => {
    this.#noPointComponent = new NoPointView(this.#filterType);
    render(this.#noPointComponent, this.#pointListContainer);
  };

  // 'Список точек маршрута'
  #renderPointList = () => {
    render(this.#pointListComponent, this.#pointListContainer);
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
  #handleViewAction = async (actionType, updateType, updatedPoint) => {
    this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointPresenterMap.get(updatedPoint.id).setSaving();

        try {
          await this.#pointsModel.updatePoint(updateType, updatedPoint);
        } catch(err) {
          this.#pointPresenterMap.get(updatedPoint.id).setAborting();
          throw err;
        }
        break;
      case UserAction.ADD_POINT:
        this.#pointNewPresenter.setSaving();

        try {
          await this.#pointsModel.addPoint(updateType, updatedPoint);
        } catch(err) {
          this.#pointNewPresenter.setAborting();
          throw err;
        }
        break;
      case UserAction.DELETE_POINT:
        this.#pointPresenterMap.get(updatedPoint.id).setDeleting();

        try {
          await this.#pointsModel.deletePoint(updateType, updatedPoint);
        } catch(err) {
          this.#pointPresenterMap.get(updatedPoint.id).setAborting();
          throw err;
        }
        break;
    }

    this.#uiBlocker.unblock();
  };

  // Обработчик-наблюдатель, который реагирует на изменения модели точек маршрута
  #handleModelEvent = (updateType, data) => {
    const resetSortType = data ? !data.id : false; // сбрасываем сортировку при смене фильтра

    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenterMap.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearPointList();
        this.#renderPoints();
        break;
      case UpdateType.MAJOR:
        this.#clearPage({resetSortType});
        this.#renderPage();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#clearPage({rerenderNewPointButton: true});
        this.#renderPage({rerenderNewPointButton: true, rerenderPointList: true});
        break;
    }
  };

  // Закрываем все формы редактирования
  #handleModeChange = () => {
    this.#pointNewPresenter.destroy();
    this.#pointPresenterMap.forEach((presenter) => presenter.resetView());
  };

  // 'Точка маршрута'
  #renderPoint = (point, offersByAllTypes, allDestinations) => {
    const pointPresenter = new PointPresenter(this.#pointListComponent.element,
      offersByAllTypes, allDestinations, this.#handleViewAction, this.#handleModeChange);
    pointPresenter.init(point);

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

  #clearPage = ({rerenderNewPointButton = false, resetSortType = false} = {}) => {
    this.#pointNewPresenter.destroy();
    this.#clearPointList();

    if (rerenderNewPointButton) {
      remove(this.#newPointButtonComponent);
    }

    remove(this.#loadingComponent);

    if (this.#tripComponent) {
      remove(this.#tripComponent);
    }

    if (this.#sortComponent) {
      remove(this.#sortComponent);
    }

    if (this.#noPointComponent) {
      remove(this.#noPointComponent);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  };

  #renderPage = ({rerenderNewPointButton = false, rerenderPointList = false} = {}) => {
    if (rerenderNewPointButton) {
      this.#renderNewPointButton();
    }

    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    if (!this.points.length) {
      this.#renderNoPoints();
      return;
    }

    this.#renderTrip();

    if (rerenderPointList) {
      this.#renderPointList();
    }

    this.#renderSort();
    this.#renderPoints();
  };
}
