import { createElement } from '../render.js';

const createPointListTemplate = () => '<ul class="trip-events__list"></ul>';

export default class PointListView {
  #element = null;

  get template() {
    return createPointListTemplate();
  }

  get element() {
    if(!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
