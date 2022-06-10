import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import he from 'he';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { humanizePointDateTime, findOffersByType, findDestinationByName } from '../utils/point.js';

const DEFAULT_TYPE = 'taxi';

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
const createPointEditViewEventTypeListTemplate = (offersByAllTypes, currentType) => offersByAllTypes.map((offersByOneType) => {
  const type = offersByOneType.type;

  return (
    `<div class="event__type-item">
      <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type"
        value="${type}"
        ${currentType === type ? 'checked' : ''}
        >
      <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${type}</label>
    </div>`
  );
}).join('');

// Пункт назначения в выпадающем списке
const createPointEditViewDestinationListTemplate = (allDestinations) => allDestinations.map((destination) => (
  `<option value="${destination.name}"></option>`
)).join('');

// Кнопка открытия/закрытия формы редактирования
const createPointEditViewRollupButtonTemplate = (id, isDisabled) => id ? (
  `<button class="event__rollup-btn" type="button"
    ${isDisabled ? 'disabled' : ''}
  >
    <span class="visually-hidden">Open event</span>
  </button>`
) : '';

// Доп. опция
const createPointEditViewOfferSelectorTemplate = (offer, selectedOfferIds, isDisabled) => {
  const {id, title, price} = offer;

  return (
    `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${id}" type="checkbox" name="event-offer-${id}"
        ${selectedOfferIds.includes(id) ? 'checked' : ''}
        ${isDisabled ? 'disabled' : ''}
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
const createPointEditViewOffersSectionTemplate = (offersByType, selectedOfferIds, isDisabled) => {
  const offerSelectorsTemplate = offersByType
    .map((offer) => createPointEditViewOfferSelectorTemplate(offer, selectedOfferIds, isDisabled))
    .join('');

  return (
    `<section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>

      <div class="event__available-offers">
        ${offerSelectorsTemplate}
      </div>
    </section>`
  );
};

// Фотография пункта назначения
const createPointEditViewEventPhotoTemplate = (photo) => (
  `<img class="event__photo" src="http://picsum.photos/248/152?r=${photo.src}" alt="${photo.description}"></img>`
);

// Контейнер с фотографиями пункта назначения
const createPointEditViewPhotosContainerTemplate = (photos) => {
  const eventPhotosTemplate = photos.map((photo) => createPointEditViewEventPhotoTemplate(photo)).join('');

  return (
    `<div class="event__photos-container">
      <div class="event__photos-tape">
        ${eventPhotosTemplate}
      </div>
    </div>`
  );
};

// Секция с описанием пункта назначения
const createPointEditViewDestinationSectionTemplate = (description, photos) => {
  const photosContainerTemplate = photos?.length ? createPointEditViewPhotosContainerTemplate(photos) : '';

  return (
    `<section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${description}</p>
      ${photosContainerTemplate}
    </section>`
  );
};

const createPointEditTemplate = (offersByAllTypes, offersByType, allDestinations, data) => {
  const {
    basePrice,
    dateFrom,
    dateTo,
    id,
    type,
    destinationName,
    destinationDescription,
    destinationPhotos,
    isDisabled,
    isSaving,
    isDeleting,
  } = data;

  const startTime = humanizePointDateTime(dateFrom);
  const endTime = humanizePointDateTime(dateTo);
  const selectedOfferIds = data.offers;
  const isSubmitDisabled = !basePrice || !startTime || !endTime || !type || !destinationName;
  const resetButtonTitle = id ? 'Delete' : 'Cancel';

  const eventTypesTemplate = createPointEditViewEventTypeListTemplate(offersByAllTypes, type);
  const destinationsTemplate = createPointEditViewDestinationListTemplate(allDestinations);
  const rollupButtonTemplate = createPointEditViewRollupButtonTemplate(id, isDisabled);
  const offersSectionTemplate = offersByType?.length ?
    createPointEditViewOffersSectionTemplate(offersByType, selectedOfferIds, isDisabled) :
    '';
  const destinationSectionTemplate = destinationDescription ?
    createPointEditViewDestinationSectionTemplate(destinationDescription, destinationPhotos) :
    '';

  return (`<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn ${isDisabled ? 'disabled' : ''}" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox"
            ${isDisabled ? 'disabled' : ''}
          >

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>
              ${eventTypesTemplate}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output ${isDisabled ? 'disabled' : ''}" for="event-destination-1">
            ${type}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination"
            value="${he.encode(destinationName)}" list="destination-list-1"
            ${isDisabled ? 'disabled' : ''}
          >
          <datalist id="destination-list-1">
            ${destinationsTemplate}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time"
            value="${startTime}"
            ${isDisabled ? 'disabled' : ''}
          >
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time"
            value="${endTime}"
            ${isDisabled ? 'disabled' : ''}
          >
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label ${isDisabled ? 'disabled' : ''}" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price"
            min="0" step="1"
            value="${basePrice}"
            ${isDisabled ? 'disabled' : ''}
          >
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit"
          ${isSubmitDisabled || isDisabled ? 'disabled' : ''}
        >
          ${isSaving ? 'Saving...' : 'Save'}
        </button>

        <button class="event__reset-btn" type="reset"
          ${isDisabled ? 'disabled' : ''}
        >
          ${isDeleting ? 'Deleting...' : resetButtonTitle}
        </button>

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
    this.#offersByType = offersByType ? [...offersByType] : findOffersByType(offersByAllTypes, DEFAULT_TYPE);
    this.#point = {...point, destination: {...point.destination}, offers: [...point.offers]};

    this._state = PointEditView.convertPointToState(this.#point, this.#offersByAllTypes);

    this.#setInnerHandlers();
    this.#setStartDatePicker();
    this.#setEndDatePicker();
  }

  get template() {
    return createPointEditTemplate(this.#offersByAllTypes, this.#offersByType, this.#allDestinations, this._state);
  }

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

  #setStartDatePicker = () => {
    this.#startDatePicker = flatpickr(
      this.element.querySelector('#event-start-time-1'),
      {
        enableTime: true,
        'time_24hr': true,
        dateFormat: 'd/m/Y H:i',
        defaultDate: this._state.dateFrom,
        maxDate: this._state.dateTo,
        onClose: this.#dateFromChangeHandler,
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
        onClose: this.#dateToChangeHandler,
      },
    );
  };

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

  // Изменение типа
  #eventTypeChangeHandler = (evt) => {
    const newType = evt.target.value;
    const prevSelectedOfferIds = findOffersByType(this._state.tempSelectedOfferIdsByAllTypes, newType);

    this.#offersByType = findOffersByType(this.#offersByAllTypes, newType);

    this.updateElement({
      type: newType,
      offers: prevSelectedOfferIds,
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
      dateFrom: selectedDate,
    });
  };

  // Изменение даты окончания
  #dateToChangeHandler = ([selectedDate]) => {
    this.updateElement({
      dateTo: selectedDate,
    });
  };

  // Изменение цены
  #priceChangeHandler = (evt) => {
    let newPrice = Math.round(evt.target.value);

    if (isNaN(newPrice)) {
      newPrice = '';
    }

    this.updateElement({
      basePrice: newPrice,
    });
  };

  // Изменение доп. опций
  #offerClickHandler = (evt) => {
    const isChecked = evt.target.checked;
    const newOfferId = +evt.target.id.replace('event-offer-', '');

    const oldOfferIds = [...this._state.offers];
    let newOfferIds;

    if (isChecked) {
      newOfferIds = [...oldOfferIds, newOfferId];
    } else {
      newOfferIds = oldOfferIds.filter((offerId) => offerId !== newOfferId);
    }

    // В процессе редактирования сохраняем в state все выбранные пользователем опции по всем типам событий
    this._state.tempSelectedOfferIdsByAllTypes.find((offersByOneType) => offersByOneType.type === this._state.type)
      .offers = newOfferIds;

    this._setState({
      offers: newOfferIds,
    });
  };

  #setInnerHandlers = () => {
    this.element.querySelector('.event__type-list')
      .addEventListener('change', this.#eventTypeChangeHandler);
    this.element.querySelector('#event-destination-1')
      .addEventListener('change', this.#destinationChangeHandler);
    this.element.querySelector('#event-price-1')
      .addEventListener('change', this.#priceChangeHandler);

    if (this.#offersByType?.length) {
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

  static convertPointToState = (point, offersByAllTypes) => ({...point,
    destinationName: point.destination?.name  ? point.destination.name : '',
    destinationDescription: point.destination?.description ? point.destination.description : '',
    destinationPhotos: point.destination?.pictures ? [...point.destination.pictures] : [],
    tempSelectedOfferIdsByAllTypes : offersByAllTypes.map((offersByOneType) => (
      {...offersByOneType,
        offers: offersByOneType.type === point.type ? [...point.offers] : []}
    )),
    isDisabled: false,
    isSaving: false,
    isDeleting: false,
  });

  static convertStateToPoint = (state) => {
    const point = {...state};

    point.destination.name = point.destinationName;
    point.destination.description = point.destinationDescription;
    point.destination.pictures = [...point.destinationPhotos];
    point.offers = findOffersByType(point.tempSelectedOfferIdsByAllTypes, point.type);

    delete point.destinationName;
    delete point.destinationDescription;
    delete point.destinationPhotos;
    delete point.tempSelectedOfferIdsByAllTypes;
    delete point.isDisabled;
    delete point.isSaving;
    delete point.isDeleting;

    return point;
  };
}
