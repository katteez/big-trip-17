import { render, replace, remove } from '../framework/render.js';
import PointEditView from '../view/point-edit-view.js';
import PointView from '../view/point-view.js';
import { findOffersByType } from '../utils/point.js';

const Mode = {
  DEFAULT: 'default',
  EDITING: 'editing',
};

export default class PointPresenter {
  #pointListContainer = null;
  #offersByAllTypes = null;
  #allDestinations = null;
  #changeData = null;
  #changeMode = null;

  #point = null;
  #mode = Mode.DEFAULT;

  #pointComponent = null;
  #pointEditComponent = null;

  constructor(pointListContainer, offersByAllTypes, allDestinations, changeData, changeMode) {
    this.#pointListContainer = pointListContainer;
    this.#offersByAllTypes = offersByAllTypes;
    this.#allDestinations = allDestinations;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
  }

  init = (point) => {
    this.#point = point;
    const offersByType = findOffersByType(this.#offersByAllTypes, point.type);

    const prevPointComponent = this.#pointComponent;
    const prevPointEditComponent = this.#pointEditComponent;

    this.#pointComponent = new PointView(offersByType, point);
    this.#pointEditComponent = new PointEditView(this.#allDestinations, this.#offersByAllTypes, offersByType, point);

    this.#pointComponent.setEditClickHandler(this.#handleEditClick);
    this.#pointComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.#pointEditComponent.setRollupButtonClickHandler(this.#handleClick);
    this.#pointEditComponent.setFormSubmitHandler(this.#handleFormSubmit);

    if (!prevPointComponent || !prevPointEditComponent) {
      render(this.#pointComponent, this.#pointListContainer);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#pointEditComponent, prevPointEditComponent);
    }

    remove(prevPointComponent);
    remove(prevPointEditComponent);
  };

  destroy = () => {
    remove(this.#pointComponent);
    remove(this.#pointEditComponent);
  };

  // Для закрытия всех форм редактирования из PagePresenter
  resetView = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#replaceFormToPoint();
    }
  };

  // Открываем форму редактирования
  #replacePointToForm = () => {
    this.#changeMode();
    replace(this.#pointEditComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.EDITING;
  };

  // Закрываем форму редактирования
  #replaceFormToPoint = () => {
    replace(this.#pointComponent, this.#pointEditComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
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
