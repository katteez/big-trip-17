import AbstractView from '../framework/view/abstract-view.js';

const createSortItemTemplate = (sortType, currentSortType) => (
  `<div class="trip-sort__item  trip-sort__item--${sortType}">
    <input
      id="sort-${sortType}"
      class="trip-sort__input  visually-hidden"
      type="radio" name="trip-sort"
      value="sort-${sortType}"
      data-sort-type="${sortType}"
      ${sortType === currentSortType ? 'checked' : ''}
    >
    <label class="trip-sort__btn" for="sort-${sortType}">${sortType}</label>
  </div>`
);

const createSortTemplate = (sortTypes, currentSortType) => {
  const sortItemsTemplate = sortTypes.map((type) => createSortItemTemplate(type, currentSortType)).join('');

  return (
    `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      ${sortItemsTemplate}
    </form>`
  );
};

export default class SortView extends AbstractView {
  #sortTypes = null;
  #currentSortType = null;

  constructor(sortTypes, currentSortType) {
    super();
    this.#sortTypes = sortTypes;
    this.#currentSortType = currentSortType;
  }

  get template() {
    return createSortTemplate(this.#sortTypes, this.#currentSortType);
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
