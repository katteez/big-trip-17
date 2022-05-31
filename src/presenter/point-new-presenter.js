import { nanoid } from 'nanoid';
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

    this.#destroyCallback?.();

    remove(this.#pointEditComponent);
    this.#pointEditComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  #handleFormSubmit = (newPoint) => {
    this.#changeData(
      UserAction.ADD_POINT,
      UpdateType.MAJOR,
      {id: nanoid(), ...newPoint},
    );
    this.destroy();
  };

  #handleDeleteClick = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };
}
