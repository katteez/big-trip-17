import AbstractView from '../framework/view/abstract-view.js';

const createSortItemTemplate = (sortType, isChecked) => (
  `<div class="trip-sort__item  trip-sort__item--${sortType}">
    <input
      id="sort-${sortType}"
      class="trip-sort__input  visually-hidden"
      type="radio" name="trip-sort"
      value="sort-${sortType}"
      data-sort-type="${sortType}"
      ${isChecked ? 'checked' : ''}
    >
    <label class="trip-sort__btn" for="sort-${sortType}">${sortType}</label>
  </div>`
);

const createSortTemplate = (sortTypes) => {
  const sortItemsTemplate = sortTypes.map((type, index) => createSortItemTemplate(type, index === 0)).join('');

  return (
    `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      ${sortItemsTemplate}
    </form>`
  );
};

export default class SortView extends AbstractView {
  #sortTypes = null;

  constructor(sortTypes) {
    super();
    this.#sortTypes = sortTypes;
  }

  get template() {
    return createSortTemplate(this.#sortTypes);
  }

  setSortTypeChangeHandler = (callback) => {
    this._callback.sortTypeChange = callback;
    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  };

  #sortTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'INPUT') {
      return;
    }

    this._callback.sortTypeChange(evt.target.dataset.sortType);
  };
}
