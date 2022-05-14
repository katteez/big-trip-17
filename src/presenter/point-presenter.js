import { render, replace } from '../framework/render.js';
import PointEditView from '../view/point-edit-view.js';
import PointView from '../view/point-view.js';

export default class PointPresenter {
  #pointListContainer = null;

  #pointComponent = null;
  #pointEditComponent = null;

  #point = null;

  constructor(pointListContainer) {
    this.#pointListContainer = pointListContainer;
  }

  init = (point, offersByPointType) => {
    this.#point = point;

    this.#pointComponent = new PointView(offersByPointType, point);
    this.#pointEditComponent = new PointEditView(offersByPointType, point);

    this.#pointComponent.setEditClickHandler(this.#handleEditClick);
    this.#pointEditComponent.setClickHandler(this.#handleClick);
    this.#pointEditComponent.setFormSubmitHandler(this.#handleFormSubmit);

    render(this.#pointComponent, this.#pointListContainer);
  };

  // Открываем форму редактирования
  #replacePointToForm = () => {
    replace(this.#pointEditComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  // Закрываем форму редактирования
  #replaceFormToPoint = () => {
    replace(this.#pointComponent, this.#pointEditComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#replaceFormToPoint();
    }
  };

  // Обработчик для открытия формы редактирования
  #handleEditClick = () => {
    this.#replacePointToForm();
  };

  // Обработчик для закрытия формы редактирования
  #handleClick = () => {
    this.#replaceFormToPoint();
  };

  // Обработчик для отправки отредактированных данных
  #handleFormSubmit = () => {
    this.#replaceFormToPoint();
  };
}
