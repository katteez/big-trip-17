import AbstractView from '../framework/view/abstract-view.js';

const createNewPointButtonTemplate = (isDisabled) => (
  `<button
    class="trip-main__event-add-btn  btn  btn--big  btn--yellow"
    type="button"
    ${isDisabled ? 'disabled' : ''}
  >
    New event
  </button>`
);

export default class NewPointButtonView extends AbstractView {
  #isDisabled = null;

  constructor(isDisabled) {
    super();
    this.#isDisabled = isDisabled;
  }

  get template() {
    return createNewPointButtonTemplate(this.#isDisabled);
  }

  setClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.addEventListener('click', this._callback.click);
  };
}
