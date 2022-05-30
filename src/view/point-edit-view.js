import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { TYPES, DESTINATIONS } from '../const.js';
import { humanizePointDateTime, formatDateToJson, findOffersByType, findDestinationByName } from '../utils/point.js';

const DEFAULT_TYPE = TYPES[0];

const BLANK_POINT = {
  basePrice: '',
  dateFrom: null,
  dateTo: null,
  destination: null,
  id: null,
  isFavorite: false,
  offers: [],
  type: DEFAULT_TYPE,
};

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
const createPointEditViewRollupButtonTemplate = (id) => id ? (
  `<button class="event__rollup-btn" type="button">
    <span class="visually-hidden">Open event</span>
  </button>`
) : '';

// Доп. опция
const createPointEditViewOfferSelectorTemplate = (offer, selectedOfferIds) => {
  const {id, title, price} = offer;
  const checked = selectedOfferIds.includes(id) ? 'checked' : '';

  return (
    `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${id}" type="checkbox" name="event-offer-${id}"
        ${checked}
      >
      <label class="event__offer-label" for="event-offer-${id}">
        <span class="event__offer-title">${title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${price}</span>
      </label>
    </div>`
  );
};

// Секция с доп. опциями
const createPointEditViewOffersSectionTemplate = (offersByType, selectedOfferIds) => {
  if (offersByType && offersByType.length) {
    const offerSelectorsTemplate = offersByType
      .map((offer) => createPointEditViewOfferSelectorTemplate(offer, selectedOfferIds))
      .join('');

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
const createPointEditViewEventPhotoTemplate = (photo) => (
  `<img class="event__photo" src="http://picsum.photos/248/152?r=${photo.src}" alt="${photo.description}"></img>`
);

// Контейнер с фотографиями пункта назначения
const createPointEditViewPhotosContainerTemplate = (photos) => {
  if(photos && photos.length) {
    const eventPhotosTemplate = photos.map((photo) => createPointEditViewEventPhotoTemplate(photo)).join('');

    return (
      `<div class="event__photos-container">
        <div class="event__photos-tape">
          ${eventPhotosTemplate}
        </div>
      </div>`
    );
  }

  return '';
};

// Секция с описанием пункта назначения
const createPointEditViewDestinationSectionTemplate = (description, photos) => {
  if(description) {
    const photosContainerTemplate = createPointEditViewPhotosContainerTemplate(photos);

    return (
      `<section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${description}</p>
        ${photosContainerTemplate}
      </section>`
    );
  }

  return '';
};

const createPointEditTemplate = (offersByType, data) => {
  const {
    basePrice,
    dateFrom,
    dateTo,
    id,
    type,
    destinationName,
    destinationDescription,
    destinationPhotos,
  } = data;

  const startTime = humanizePointDateTime(dateFrom);
  const endTime = humanizePointDateTime(dateTo);
  const selectedOfferIds = data.offers;
  const isSubmitDisabled = !basePrice || !startTime || !endTime || !type || !destinationName;

  const eventTypesTemplate = createPointEditViewEventTypeListTemplate(type);
  const destinationsTemplate = createPointEditViewDestinationListTemplate();
  const rollupButtonTemplate = createPointEditViewRollupButtonTemplate(id);
  const offersSectionTemplate = createPointEditViewOffersSectionTemplate(offersByType, selectedOfferIds);
  const destinationSectionTemplate = createPointEditViewDestinationSectionTemplate(destinationDescription, destinationPhotos);

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
          <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price"
            min="0" step="1"
            value="${basePrice}"
          >
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit"
          ${isSubmitDisabled ? 'disabled' : ''}
        >Save</button>
        <button class="event__reset-btn" type="reset">Delete</button>
        ${rollupButtonTemplate}
      </header>
      <section class="event__details">
        ${offersSectionTemplate}

        ${destinationSectionTemplate}
      </section>
    </form>
  </li>`
  );
};

export default class PointEditView extends AbstractStatefulView {
  #allDestinations = null;
  #offersByAllTypes = null;
  #offersByType = null;
  #point = null;

  #startDatePicker = null;
  #endDatePicker = null;

  constructor(allDestinations, offersByAllTypes, offersByType, point = BLANK_POINT) {
    super();
    this.#allDestinations = allDestinations;
    this.#offersByAllTypes = offersByAllTypes;
    this.#offersByType = offersByType ? offersByType : findOffersByType(offersByAllTypes, DEFAULT_TYPE);
    this.#point = {...point, destination: {...point.destination}};
    this._state = PointEditView.convertPointToState(this.#point);

    this.#setInnerHandlers();
    this.#setStartDatePicker();
    this.#setEndDatePicker();
  }

  get template() {
    return createPointEditTemplate(this.#offersByType, this._state);
  }

  setFormSubmitHandler = (callback) => {
    this._callback.formSubmit = callback;
    this.element.querySelector('form').addEventListener('submit', this.#formSubmitHandler);
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this._callback.formSubmit(PointEditView.convertStateToPoint(this._state));
  };

  setRollupButtonClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.querySelector('.event__rollup-btn')?.addEventListener('click', this._callback.click);
  };

  setDeleteClickHandler = (callback) => {
    this._callback.deleteClick = callback;
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#formDeleteClickHandler);
  };

  #formDeleteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.deleteClick(PointEditView.convertStateToPoint(this._state));
  };

  removeElement = () => {
    super.removeElement();

    if (this.#startDatePicker) {
      this.#startDatePicker.destroy();
      this.#startDatePicker = null;
    }

    if (this.#endDatePicker) {
      this.#endDatePicker.destroy();
      this.#endDatePicker = null;
    }
  };

  reset = (point) => {
    this.#offersByType = findOffersByType(this.#offersByAllTypes, point.type);

    this.updateElement(
      PointEditView.convertPointToState(point),
    );
  };

  // Изменение типа
  #eventTypeClickHandler = (evt) => {
    const newType = evt.target.value;
    this.#offersByType = findOffersByType(this.#offersByAllTypes, newType);

    this.updateElement({
      type: newType,
      offers: [],
    });
  };

  // Изменение направления
  #destinationChangeHandler = (evt) => {
    const destination = findDestinationByName(this.#allDestinations, evt.target.value);

    this.updateElement({
      destinationName: destination ? destination.name : '',
      destinationDescription: destination ? destination.description : '',
      destinationPhotos: destination ? [...destination.pictures] : [],
    });
  };

  // Изменение даты начала
  #dateFromChangeHandler = ([selectedDate]) => {
    this.updateElement({
      dateFrom: formatDateToJson(selectedDate),
    });
  };

  // Изменение даты окончания
  #dateToChangeHandler = ([selectedDate]) => {
    this.updateElement({
      dateTo: formatDateToJson(selectedDate),
    });
  };

  #setStartDatePicker = () => {
    this.#startDatePicker = flatpickr(
      this.element.querySelector('#event-start-time-1'),
      {
        enableTime: true,
        'time_24hr': true,
        dateFormat: 'd/m/Y H:i',
        defaultDate: this._state.dateFrom,
        maxDate: this._state.dateTo,
        onChange: this.#dateFromChangeHandler,
      },
    );
  };

  #setEndDatePicker = () => {
    this.#endDatePicker = flatpickr(
      this.element.querySelector('#event-end-time-1'),
      {
        enableTime: true,
        'time_24hr': true,
        dateFormat: 'd/m/Y H:i',
        defaultDate: this._state.dateTo,
        minDate: this._state.dateFrom,
        onChange: this.#dateToChangeHandler,
      },
    );
  };

  // Изменение цены
  #priceInputHandler = (evt) => {
    const regex = new RegExp('^[0-9]+$'); // только цифры
    let newPrice = +evt.target.value;

    if(!regex.test(newPrice)) {
      newPrice = '';
    }

    this.updateElement({
      basePrice: newPrice,
    });
  };

  // Изменение доп. опций
  #offerClickHandler = (evt) => {
    const toAdd = evt.target.checked;
    const idStringArray = evt.target.id.split('event-offer-');
    const newOfferId = +idStringArray[idStringArray.length-1];

    const oldOfferIds = [...this._state.offers];
    let newOfferIds;

    if (toAdd) {
      newOfferIds = [...oldOfferIds, newOfferId];
    } else {
      const id = oldOfferIds.findIndex((offerId) => offerId === newOfferId);
      oldOfferIds.splice(id, 1);
      newOfferIds = oldOfferIds;
    }

    this._setState({
      offers: newOfferIds,
    });
  };

  #setInnerHandlers = () => {
    this.element.querySelector('.event__type-list')
      .addEventListener('change', this.#eventTypeClickHandler);
    this.element.querySelector('#event-destination-1')
      .addEventListener('change', this.#destinationChangeHandler);
    this.element.querySelector('#event-price-1')
      .addEventListener('change', this.#priceInputHandler);

    if (this.#offersByType && this.#offersByType.length) {
      this.element.querySelector('.event__available-offers')
        .addEventListener('change', this.#offerClickHandler);
    }
  };

  _restoreHandlers = () => {
    this.#setInnerHandlers();
    this.#setStartDatePicker();
    this.#setEndDatePicker();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setRollupButtonClickHandler(this._callback.click);
    this.setDeleteClickHandler(this._callback.deleteClick);
  };

  static convertPointToState = (point) => ({...point,
    destinationName: point.destination?.name  ? point.destination.name : '',
    destinationDescription: point.destination?.description ? point.destination.description : '',
    destinationPhotos: point.destination?.pictures ? [...point.destination.pictures] : [],
  });

  static convertStateToPoint = (state) => {
    const point = {...state};

    point.destination.name = point.destinationName;
    point.destination.description = point.destinationDescription;
    point.destination.pictures = [...point.destinationPhotos];

    delete point.destinationName;
    delete point.destinationDescription;
    delete point.destinationPhotos;

    return point;
  };
}
