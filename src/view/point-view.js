import he from 'he';
import AbstractView from '../framework/view/abstract-view.js';
import {
  humanizePointDate,
  humanizePointDateForAttribute,
  humanizePointTime,
  humanizePointTimeForAttribute,
  getDuration,
  humanizeDuration
} from '../utils/point.js';

// Доп. опции
const createPointViewOffersTemplate = (selectedOfferIds, offers) => selectedOfferIds.map((selectedOfferId) => {
  // Находим выбранную опцию по ее Id
  const selectedOffer = offers.find((offer) => offer.id === selectedOfferId);

  return (
    `<li class="event__offer">
      <span class="event__offer-title">${selectedOffer.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${selectedOffer.price}</span>
    </li>`
  );
}).join('');

const createPointTemplate = (offers, point) => {
  const { basePrice, dateFrom, dateTo, destination, isFavorite, type } = point;

  const selectedOfferIds = point.offers;

  const startDate = humanizePointDate(dateFrom);
  const startDateForAttribute = humanizePointDateForAttribute(dateFrom);

  const startTime = humanizePointTime(dateFrom);
  const startTimeForAttribute = humanizePointTimeForAttribute(dateFrom);

  const endTime = humanizePointTime(dateTo);
  const endTimeForAttribute = humanizePointTimeForAttribute(dateTo);

  const duration = humanizeDuration(getDuration(dateTo, dateFrom));

  const offersTemplate = selectedOfferIds && selectedOfferIds.length ? createPointViewOffersTemplate(selectedOfferIds, offers) : '';

  return (
    `<li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="${startDateForAttribute}">${startDate}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${type} ${he.encode(destination.name)}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${startTimeForAttribute}">${startTime}</time>
            &mdash;
            <time class="event__end-time" datetime="${endTimeForAttribute}">${endTime}</time>
          </p>
          <p class="event__duration">${duration}</p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${offersTemplate}
        </ul>
        <button class="event__favorite-btn ${isFavorite ? 'event__favorite-btn--active' : ''}" type="button">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`
  );
};

export default class PointView extends AbstractView {
  #offers = null;
  #point = null;

  constructor(offers, point) {
    super();
    this.#offers = offers;
    this.#point = point;
  }

  get template() {
    return createPointTemplate(this.#offers, this.#point);
  }

  setEditClickHandler = (callback) => {
    this._callback.editClick = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this._callback.editClick);
  };

  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.element.querySelector('.event__favorite-btn').addEventListener('click', this._callback.favoriteClick);
  };
}
