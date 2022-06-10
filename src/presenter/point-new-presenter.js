import { render, remove, RenderPosition } from '../framework/render.js';
import PointEditView from '../view/point-edit-view.js';
import { UserAction, UpdateType } from '../const.js';

export default class PointNewPresenter {
  #allDestinations = null;
  #offersByAllTypes = null;
  #pointListContainer = null;
  #changeData = null;

  #destroyCallback = null;
  #pointEditComponent = null;

  constructor(allDestinations, offersByAllTypes, pointListContainer, changeData) {
    this.#allDestinations = allDestinations;
    this.#offersByAllTypes = offersByAllTypes;
    this.#pointListContainer = pointListContainer;
    this.#changeData = changeData;
  }

  init = (callback) => {
    this.#destroyCallback = callback;

    if (this.#pointEditComponent) {
      return;
    }

    this.#pointEditComponent = new PointEditView(this.#allDestinations, this.#offersByAllTypes);
    this.#pointEditComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#pointEditComponent.setDeleteClickHandler(this.#handleDeleteClick);

    render(this.#pointEditComponent, this.#pointListContainer, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  destroy = () => {
    if (!this.#pointEditComponent) {
      return;
    }

    remove(this.#pointEditComponent);
    this.#pointEditComponent = null;

    this.#destroyCallback?.();

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  // Блокируем форму во время отправки данных на сервер при добавлении точки
  setSaving = () => {
    this.#pointEditComponent.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  };

  // Если в процессе запроса на сервер произошла ошибка, трясем форму и разблокируем ее
  setAborting = () => {
    const resetFormState = () => {
      this.#pointEditComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#pointEditComponent.shake(resetFormState);
  };

  // Обработчик для отправки созданных данных
  #handleFormSubmit = (newPoint) => {
    this.#changeData(
      UserAction.ADD_POINT,
      UpdateType.MAJOR,
      newPoint,
    );
  };

  // Обработчик для удаления точки маршрута
  #handleDeleteClick = () => {
    this.destroy();
  };

  // Обработчик для закрытия формы без сохранения по Escape
  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };
}
