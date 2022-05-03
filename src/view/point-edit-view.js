import { createElement } from '../render.js';
import { TYPES, DESTINATIONS } from '../const.js';
import { getRandomInteger, humanizePointDateTime } from '../utils.js';

// Тип маршрута в выпадающем списке
const createPointEditViewEventTypeListTemplate = (currentType) => TYPES.map((type) => (
  `<div class="event__type-item">
    <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type"
      value="${type}"
      ${currentType === type ? 'checked' : ''}
      >
    <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${type}</label>
  </div>`
)).join('');

// Пункт назначения в выпадающем списке
const createPointEditViewDestinationListTemplate = () => DESTINATIONS.map((destination) => (
  `<option value="${destination}"></option>`
)).join('');

// Кнопка открытия/закрытия формы редактирования
const createPointEditViewRollupButtonTemplate = (point) => point ? (
  `<button class="event__rollup-btn" type="button">
    <span class="visually-hidden">Open event</span>
  </button>`
) : '';

// Доп. опция
const createPointEditViewOfferSelectorsTemplate = (offers, selectedOffers) => offers.map((offer) => {
  const checked = selectedOffers.includes(offer.id) ? 'checked' : '';

  return (
    `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.id}" type="checkbox" name="event-offer-${offer.id}"
        ${checked}
      >
      <label class="event__offer-label" for="event-offer-${offer.id}">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </label>
    </div>`
  );
}).join('');

// Секция с доп. опциями
const createPointEditViewOffersSectionTemplate = (offers, selectedOffers) => {
  if (offers && offers.length) {
    const offerSelectorsTemplate = createPointEditViewOfferSelectorsTemplate(offers, selectedOffers);

    return (
      `<section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>

        <div class="event__available-offers">
          ${offerSelectorsTemplate}
        </div>
      </section>`
    );
  }

  return '';
};

// Фотография пункта назначения
const createPointEditViewEventPhotoTemplate = () => {
  const photosQuantity = 5;

  return Array.from({length: photosQuantity}, () => getRandomInteger(0, 1000)).map((photoNumber) => (
    `<img class="event__photo" src="http://picsum.photos/248/152?r=${photoNumber}" alt="Event photo"></img>`
  )).join('');
};

// Контейнер с фотографиями пункта назначения
const createPointEditViewPhotosContainerTemplate = (pointId) => {
  if(!pointId) {
    const eventPhotoTemplate = createPointEditViewEventPhotoTemplate();

    return (
      `<div class="event__photos-container">
        <div class="event__photos-tape">
          ${eventPhotoTemplate}
        </div>
      </div>`
    );
  }

  return '';
};

const createPointEditTemplate = (offers, point) => {
  let basePrice = '',
    dateFrom,
    dateTo,
    destination,
    id = null,
    selectedOffers = [],
    type = TYPES[0];

  if (point) {
    basePrice = point.basePrice;
    dateFrom = point.dateFrom;
    dateTo = point.dateTo;
    destination = point.destination;
    id = point.id;
    selectedOffers = point.offers;
    type = point.type;
  }

  const startTime = dateFrom ? humanizePointDateTime(dateFrom) : '';
  const endTime = dateTo ? humanizePointDateTime(dateTo) : '';
  const destinationName = destination ? destination.name : '';
  const destinationDescription = destination ? destination.description : '';

  const eventTypesTemplate = createPointEditViewEventTypeListTemplate(type);
  const destinationsTemplate = createPointEditViewDestinationListTemplate();
  const rollupButtonTemplate = createPointEditViewRollupButtonTemplate(point);
  const offersSectionTemplate = createPointEditViewOffersSectionTemplate(offers, selectedOffers);
  const photosContainerTemplate = createPointEditViewPhotosContainerTemplate(id);

  return (`<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>
              ${eventTypesTemplate}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${type}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destinationName}" list="destination-list-1">
          <datalist id="destination-list-1">
            ${destinationsTemplate}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${startTime}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${endTime}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Delete</button>
        ${rollupButtonTemplate}
      </header>
      <section class="event__details">
        ${offersSectionTemplate}

        <section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${destinationDescription}</p>
          ${photosContainerTemplate}
        </section>
      </section>
    </form>
  </li>`
  );
};

export default class PointEditView {
  constructor(offers, point) {
    this.offers = offers;
    this.point = point;
  }

  getTemplate() {
    return createPointEditTemplate(this.offers, this.point);
  }

  getElement() {
    if(!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
