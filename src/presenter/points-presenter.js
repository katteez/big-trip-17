import { RenderPosition, render, replace } from '../framework/render.js';
import TripView from '../view/trip-view.js';
import SortView from '../view/sort-view.js';
import PointListView from '../view/point-list-view.js';
import PointEditView from '../view/point-edit-view.js';
import PointView from '../view/point-view.js';
import NoPointView from '../view/no-point-view.js';
import { FilterType, TextForNoPointView, SortType } from '../const.js';

export default class PointsPresenter {
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

  #renderPoint = (offersByPointType, point) => {
    const pointComponent = new PointView(offersByPointType, point);
    const pointEditComponent = new PointEditView(offersByPointType, point);

    // Открываем форму редактирования
    const replacePointToForm = () => {
      replace(pointEditComponent, pointComponent);
    };

    // Закрываем форму редактирования
    const replaceFormToPoint = () => {
      replace(pointComponent, pointEditComponent);
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        replaceFormToPoint();
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    // Обработчик для открытия формы редактирования
    pointComponent.setEditClickHandler(() => {
      replacePointToForm();
      document.addEventListener('keydown', onEscKeyDown);
    });

    // Обработчик для закрытия формы редактирования
    pointEditComponent.setClickHandler(() => {
      replaceFormToPoint();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    // Обработчик для отправки отредактированных данных
    pointEditComponent.setFormSubmitHandler(() => {
      replaceFormToPoint();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    render(pointComponent, this.#pointListComponent.element);
  };

  #renderPoints = () => {
    for (const point of this.#points) {
      // Получаем только те доп. опции, которые подходят под тип текущей точки маршрута
      const offersByPointType = this.#offers.find((offer) => offer.type === point.type).offers;

      this.#renderPoint(offersByPointType, point);
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
