import AbstractView from '../framework/view/abstract-view.js';
import { humanizeTripDates, getTripTitle } from '../utils/trip.js';
import { findOffersByType, calculateTotalCostForPoint } from '../utils/point.js';

const createTripTemplate = (points, offersByAllTypes) => {
  const startDate = points[0].dateFrom;
  const endDate = points[points.length-1].dateTo;
  const tripDate = humanizeTripDates(startDate, endDate);

  const tripDestinations = [];
  let totalCostForTrip = 0;

  for (const point of points) {
    tripDestinations.push(point.destination.name);

    const offersByType = findOffersByType(offersByAllTypes, point.type);
    const selectedOffers = point.offers.map((selectedOfferId) => offersByType.find((offer) => offer.id === selectedOfferId));

    totalCostForTrip += calculateTotalCostForPoint(point.basePrice, selectedOffers);
  }

  const tripTitle = getTripTitle(tripDestinations);

  return (
    `<section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${tripTitle}</h1>

        <p class="trip-info__dates">${tripDate}</p>
      </div>

      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalCostForTrip}</span>
      </p>
    </section>`
  );
};

export default class TripView extends AbstractView {
  #points = null;
  #offersByAllTypes = null;

  constructor(points, offersByAllTypes) {
    super();
    this.#points = points;
    this.#offersByAllTypes = offersByAllTypes;
  }

  get template() {
    return createTripTemplate(this.#points, this.#offersByAllTypes);
  }
}
