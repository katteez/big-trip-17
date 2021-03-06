import { render, replace, remove } from '../framework/render.js';
import PointView from '../view/point-view.js';
import PointEditView from '../view/point-edit-view.js';
import { isDatesEqual, isOffersEqual, findOffersByType } from '../utils/point.js';
import { isEscKeyDown } from '../utils/common.js';
import { UserAction, UpdateType } from '../const.js';

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
  #offersByType = null;
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
    this.#offersByType = findOffersByType(this.#offersByAllTypes, point.type);

    const prevPointComponent = this.#pointComponent;

    this.#pointComponent = new PointView(this.#offersByType, point);

    this.#pointComponent.setEditClickHandler(this.#handleEditClick);
    this.#pointComponent.setFavoriteClickHandler(this.#handleFavoriteClick);

    if (!prevPointComponent) {
      render(this.#pointComponent, this.#pointListContainer);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    }

    remove(prevPointComponent);
  };

  destroy = () => {
    remove(this.#pointComponent);
    remove(this.#pointEditComponent);
    this.#pointComponent = null;
    this.#pointEditComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  // Закрываем форму редактирования
  resetView = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#replaceFormToPoint();

      remove(this.#pointEditComponent);
      this.#pointEditComponent = null;
    }
  };

  // Блокируем форму во время отправки данных на сервер при сохранении точки
  setSaving = () => {
    if (this.#mode === Mode.EDITING) {
      this.#pointEditComponent.updateElement({
        isDisabled: true,
        isSaving: true,
      });
    }
  };

  // Блокируем форму во время отправки данных на сервер при удалении точки
  setDeleting = () => {
    if (this.#mode === Mode.EDITING) {
      this.#pointEditComponent.updateElement({
        isDisabled: true,
        isDeleting: true,
      });
    }
  };

  // Если в процессе запроса на сервер произошла ошибка...
  setAborting = () => {
    // ...трясем компонент просмотра
    if (this.#mode === Mode.DEFAULT) {
      this.#pointComponent.shake();
      return;
    }

    const resetFormState = () => {
      this.#pointEditComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    // ...трясем форму и разблокируем ее
    this.#pointEditComponent.shake(resetFormState);
  };

  // Заменяем форму просмотра на форму редактирования
  #replacePointToForm = () => {
    this.#changeMode();
    replace(this.#pointEditComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.EDITING;
  };

  // Заменяем форму редактирования на форму просмотра
  #replaceFormToPoint = () => {
    replace(this.#pointComponent, this.#pointEditComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  };

  // Обработчик для закрытия формы редактирования без сохранения по Escape
  #escKeyDownHandler = (evt) => {
    if (isEscKeyDown(evt)) {
      evt.preventDefault();
      this.resetView();
    }
  };

  // Обработчик для закрытия формы редактирования без сохранения
  #handleRollupButtonClick = () => {
    this.resetView();
  };

  // Обработчик для открытия формы редактирования
  #handleEditClick = () => {
    this.#pointEditComponent = new PointEditView(this.#allDestinations, this.#offersByAllTypes, this.#offersByType, this.#point);

    this.#pointEditComponent.setRollupButtonClickHandler(this.#handleRollupButtonClick);
    this.#pointEditComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#pointEditComponent.setDeleteClickHandler(this.#handleDeleteClick);

    this.#replacePointToForm();
  };

  // Обработчик для кнопки 'Избранное'
  #handleFavoriteClick = () => {
    this.#changeData(
      UserAction.UPDATE_POINT,
      UpdateType.PATCH,
      {...this.#point, isFavorite: !this.#point.isFavorite},
    );
  };

  // Обработчик для отправки отредактированных данных
  #handleFormSubmit = (updatedPoint) => {
    const isDataChanged = this.#point.type !== updatedPoint.type ||
      this.#point.destination.name !== updatedPoint.destination.name ||
      !isDatesEqual(this.#point.dateFrom, updatedPoint.dateFrom) ||
      !isDatesEqual(this.#point.dateTo, updatedPoint.dateTo) ||
      this.#point.basePrice !== updatedPoint.basePrice ||
      !isOffersEqual(this.#point.offers, updatedPoint.offers);

    if (isDataChanged) {
      this.#changeData(
        UserAction.UPDATE_POINT,
        UpdateType.MAJOR,
        updatedPoint,
      );
    } else {
      this.#replaceFormToPoint();
    }
  };

  // Обработчик для удаления точки маршрута
  #handleDeleteClick = (pointToDelete) => {
    this.#changeData(
      UserAction.DELETE_POINT,
      UpdateType.MAJOR,
      pointToDelete,
    );
  };
}
