import dayjs from 'dayjs';
import { getDuration } from './point.js';

// const selectedOffers = (selectedOfferIds, offersByType) => {
//   if (offersByType && offersByType.length) {
//     return selectedOfferIds.map((selectedOfferId) => offersByType.find((offer) => offer.id === selectedOfferId));
//   }

//   return [];
// };

// const sortPriceDown = (pointA, pointB) => {
//   const totalCostForPointB = calculateTotalCostForPoint(pointB.basePrice, selectedOffers(pointB.offers));
//   const totalCostForPointA = calculateTotalCostForPoint(pointA.basePrice, selectedOffers(pointA.offers));

//   return totalCostForPointB - totalCostForPointA;
// };

const sortDayUp = (pointA, pointB) => dayjs(pointA.dateFrom).diff(dayjs(pointB.dateFrom));

const sortEventTypeUp = (pointA, pointB) => {
  if (pointA.type < pointB.type) {
    return -1;
  }

  if (pointA.type > pointB.type) {
    return 1;
  }

  return 0;
};

const sortTimeDown = (pointA, pointB) => getDuration(pointB.dateTo, pointB.dateFrom) - getDuration(pointA.dateTo, pointA.dateFrom);

const sortPriceDown = (pointA, pointB) => pointB.basePrice - pointA.basePrice;

export { sortDayUp, sortEventTypeUp, sortTimeDown, sortPriceDown };
