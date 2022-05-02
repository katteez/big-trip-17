import { createElement } from '../render.js';
import { humanizeTripDates } from '../utils.js';

const createTripTemplate = (points) => {
  const tripDestinations = [];

  const startDate = points[0].dateFrom;
  const endDate = points[points.length-1].dateTo;
  const tripDate = humanizeTripDates(startDate, endDate);

  let basePriceForAllPoints = 0;
  let priceForAllPointsOffers = 0;

  for (const point of points) {
    if (tripDestinations.indexOf(point.destination.name) === -1) {
      tripDestinations.push(point.destination.name);
    }

    basePriceForAllPoints += point.basePrice;
    priceForAllPointsOffers += point.offers.reduce((total, offer) => total + offer.price, 0);
  }

  const tripTitle = tripDestinations.length <= 3
    ? tripDestinations.join(' &mdash; ')
    : `${tripDestinations[0]} &mdash;... &mdash; ${tripDestinations[tripDestinations.length-1]}`;

  const totalCost = basePriceForAllPoints + priceForAllPointsOffers;

  return (
    `<section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${tripTitle}</h1>

        <p class="trip-info__dates">${tripDate}</p>
      </div>

      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalCost}</span>
      </p>
    </section>`
  );
};

export default class TripView {
  constructor(points) {
    this.points = points;
  }

  getTemplate() {
    return createTripTemplate(this.points);
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
