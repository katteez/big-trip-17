import { render, replace, remove } from '../framework/render.js';
import PointEditView from '../view/point-edit-view.js';
import PointView from '../view/point-view.js';

export default class PointPresenter {
  #pointListContainer = null;
  #changeData = null;

  #point = null;
  #offers = null;

  #pointComponent = null;
  #pointEditComponent = null;

  constructor(pointListContainer, changeData) {
    this.#pointListContainer = pointListContainer;
    this.#changeData = changeData;
  }

  init = (point, offers = this.#offers) => {
    this.#point = point;
    this.#offers = offers;

    const prevPointComponent = this.#pointComponent;
    const prevPointEditComponent = this.#pointEditComponent;

    this.#pointComponent = new PointView(offers, point);
    this.#pointEditComponent = new PointEditView(offers, point);

    this.#pointComponent.setEditClickHandler(this.#handleEditClick);
    this.#pointComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.#pointEditComponent.setClickHandler(this.#handleClick);
    this.#pointEditComponent.setFormSubmitHandler(this.#handleFormSubmit);

    if (prevPointComponent === null || prevPointEditComponent === null) {
      render(this.#pointComponent, this.#pointListContainer);
      return;
    }

    if (this.#pointListContainer.contains(prevPointComponent.element)) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#pointListContainer.contains(prevPointEditComponent.element)) {
      replace(this.#pointEditComponent, prevPointEditComponent);
    }

    remove(prevPointComponent);
    remove(prevPointEditComponent);
  };

  destroy = () => {
    remove(this.#pointComponent);
    remove(this.#pointEditComponent);
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

  // Обработчик для кнопки 'Избранное'
  #handleFavoriteClick = () => {
    this.#changeData({...this.#point, isFavorite: !this.#point.isFavorite});
  };

  // Обработчик для закрытия формы редактирования
  #handleClick = () => {
    this.#replaceFormToPoint();
  };

  // Обработчик для отправки отредактированных данных
  #handleFormSubmit = (point) => {
    this.#changeData(point);
    this.#replaceFormToPoint();
  };
}
