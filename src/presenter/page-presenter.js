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
  #currentFilterType = FilterType.EVERYTHING;
  #currentSortType = SortType.DAY.value;
  #pointPresentersByPointIds = new Map();
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
    this.#currentFilterType = this.#filterModel.filter;
    const points = this.#pointsModel.points;
    const filteredPoints = filter[this.#currentFilterType](points);

    switch (this.#currentSortType) {
      case SortType.DAY.value:
        return filteredPoints.sort(sortDayUp);
      case SortType.EVENT.value:
        return filteredPoints.sort(sortEventTypeUp);
      case SortType.TIME.value:
        return filteredPoints.sort(sortTimeDown);
      case SortType.PRICE.value:
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

      this.#renderPage({isNecessaryToRerenderNewPointButton: true});
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
    this.#currentSortType = SortType.DAY.value;
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

  // '???????????? ???????????????? ?????????? ??????????'
  #renderNewPointButton = () => {
    this.#newPointButtonComponent = new NewPointButtonView(this.#isLoading);
    this.#newPointButtonComponent.setClickHandler(this.#handleNewPointButtonClick);
    render(this.#newPointButtonComponent, this.#tripContainer);
  };

  // '????????????????, ???????? ???????????????? ????????????'
  #renderLoading = () => {
    render(this.#loadingComponent, this.#pointListContainer);
  };

  // '???????????????????? ?????????? ????????????????'
  #renderNoPoints = () => {
    this.#noPointComponent = new NoPointView(this.#currentFilterType);
    render(this.#noPointComponent, this.#pointListContainer);
  };

  // '???????????? ?????????? ????????????????'
  #renderPointList = () => {
    render(this.#pointListComponent, this.#pointListContainer);
  };

  // '??????????????????????'
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

  // '????????????????????'
  #renderSort = () => {
    this.#sortComponent = new SortView(Object.values(SortType), this.#currentSortType);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
    render(this.#sortComponent, this.#pointListComponent.element, RenderPosition.BEFOREBEGIN);
  };

  // ?????????????????? ???????????? ?? ?????????????????????? ???? ???????????????? ????????????????????????
  #handleViewAction = async (actionType, updateType, updatedPoint) => {
    this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointPresentersByPointIds.get(updatedPoint.id).setSaving();

        try {
          await this.#pointsModel.updatePoint(updateType, updatedPoint);
        } catch(err) {
          this.#pointPresentersByPointIds.get(updatedPoint.id).setAborting();
        }
        break;
      case UserAction.ADD_POINT:
        this.#pointNewPresenter.setSaving();

        try {
          await this.#pointsModel.addPoint(updateType, updatedPoint);
        } catch(err) {
          this.#pointNewPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_POINT:
        this.#pointPresentersByPointIds.get(updatedPoint.id).setDeleting();

        try {
          await this.#pointsModel.deletePoint(updateType, updatedPoint);
        } catch(err) {
          this.#pointPresentersByPointIds.get(updatedPoint.id).setAborting();
        }
        break;
    }

    this.#uiBlocker.unblock();
  };

  // ????????????????????-??????????????????????, ?????????????? ?????????????????? ???? ?????????????????? ???????????? ?????????? ????????????????
  #handleModelEvent = (updateType, data) => {
    const resetSortType = data ? !data.id : false; // ???????????????????? ???????????????????? ?????? ?????????? ??????????????

    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresentersByPointIds.get(data.id).init(data);
        break;
      case UpdateType.MAJOR:
        this.#clearPage({resetSortType});
        this.#renderPage();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#clearPage({isNecessaryToRerenderNewPointButton: true});
        this.#renderPage({isNecessaryToRerenderNewPointButton: true, isNecessaryToRerenderPointList: true});
        break;
    }
  };

  // ?????????????????? ?????? ?????????? ????????????????????????????
  #handleModeChange = () => {
    this.#pointNewPresenter.destroy();
    this.#pointPresentersByPointIds.forEach((presenter) => presenter.resetView());
  };

  // '?????????? ????????????????'
  #renderPoint = (point, offersByAllTypes, allDestinations) => {
    const pointPresenter = new PointPresenter(this.#pointListComponent.element,
      offersByAllTypes, allDestinations, this.#handleViewAction, this.#handleModeChange);
    pointPresenter.init(point);

    this.#pointPresentersByPointIds.set(point.id, pointPresenter);
  };

  #renderPoints = () => {
    for (const point of this.points) {
      this.#renderPoint(point, this.#offers, this.#destinations);
    }
  };

  #clearPointList = () => {
    this.#pointPresentersByPointIds.forEach((presenter) => presenter.destroy());
    this.#pointPresentersByPointIds.clear();
  };

  #clearPage = ({isNecessaryToRerenderNewPointButton = false, resetSortType = false} = {}) => {
    this.#pointNewPresenter.destroy();
    this.#clearPointList();

    if (isNecessaryToRerenderNewPointButton) {
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
      this.#currentSortType = SortType.DAY.value;
    }
  };

  #renderPage = ({isNecessaryToRerenderNewPointButton = false, isNecessaryToRerenderPointList = false} = {}) => {
    if (isNecessaryToRerenderNewPointButton) {
      this.#renderNewPointButton();
    }

    if (isNecessaryToRerenderPointList) {
      this.#renderPointList();
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

    this.#renderSort();
    this.#renderPoints();
  };
}
