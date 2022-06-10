import AbstractView from '../framework/view/abstract-view.js';

const createSortItemTemplate = (sortType, currentSortType) => (
  `<div class="trip-sort__item  trip-sort__item--${sortType.value}">
    <input
      id="sort-${sortType.value}"
      class="trip-sort__input  visually-hidden"
      type="radio" name="trip-sort"
      value="sort-${sortType.value}"
      data-sort-type="${sortType.value}"
      ${sortType.value === currentSortType ? 'checked' : ''}
      ${sortType.isDisabled ? 'disabled' : ''}
    >
    <label class="trip-sort__btn" for="sort-${sortType.value}">${sortType.name}</label>
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
    this.element.addEventListener('change', this.#sortTypeChangeHandler);
  };

  #sortTypeChangeHandler = (evt) => {
    this._callback.sortTypeChange(evt.target.dataset.sortType);
  };
}
