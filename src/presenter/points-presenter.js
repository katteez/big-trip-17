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

    // Открываем форму редактирования
    const replacePointToForm = () => {
      this.#pointListComponent.element.replaceChild(pointEditComponent.element, pointComponent.element);
    };

    // Закрываем форму редактирования
    const replaceFormToPoint = () => {
      this.#pointListComponent.element.replaceChild(pointComponent.element, pointEditComponent.element);
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        replaceFormToPoint();
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    // Обработчик для открытия формы редактирования
    pointComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
      replacePointToForm();
      document.addEventListener('keydown', onEscKeyDown);
    });

    // Обработчик для закрытия формы редактирования
    pointEditComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
      replaceFormToPoint();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    // Отправка отредактированных данных
    pointEditComponent.element.querySelector('form').addEventListener('submit', (evt) => {
      evt.preventDefault();
      replaceFormToPoint();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    render(pointComponent, this.#pointListComponent.element);
  };
}
