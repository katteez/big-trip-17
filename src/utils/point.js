import dayjs from 'dayjs';
import { getArraysDifference } from '../utils/common.js';

const humanizePointDate = (date) => date ? dayjs(date).format('MMM DD') : '';
const humanizePointDateForAttribute = (date) => date ? dayjs(date).format('YYYY-MM-DD') : '';

const humanizePointTime = (date) => date ? dayjs(date).format('HH:mm') : '';
const humanizePointTimeForAttribute = (date) => date ? dayjs(date).format('YYYY-MM-DDTHH:mm') : '';

const humanizePointDateTime = (date) => date ? dayjs(date).format('DD/MM/YY HH:mm') : '';

const getDuration = (dateTo, dateFrom) => {
  if (dateTo && dateFrom) {
    const endDate = dayjs(dateTo).second(0).millisecond(0);
    const startDate = dayjs(dateFrom).second(0).millisecond(0);

    return dayjs(endDate).diff(dayjs(startDate));
  }

  return '';
};

const millisecondsPerSecond = 1000;
const secondsPerMinute = 60;
const minutesPerHour = 60;
const hoursPerDay = 24;
const millisecondsPerMinute = millisecondsPerSecond * secondsPerMinute;
const millisecondsPerHour = millisecondsPerMinute * minutesPerHour;
const millisecondsPerDay = millisecondsPerHour * hoursPerDay;

const humanizeDuration = (duration) => {
  if (duration > 0) {
    const divisionByDaysRemainder = duration % millisecondsPerDay;
    const divisionByHoursRemainder = duration % millisecondsPerHour;

    const durationInDays = Math.floor(duration / millisecondsPerDay);
    const durationInHours = Math.floor(divisionByDaysRemainder / millisecondsPerHour);
    const durationInMinutes = Math.floor(divisionByHoursRemainder / millisecondsPerMinute);

    const formattedDaysToTwoNumber = durationInDays > 9 ? durationInDays : `0${durationInDays}`;
    const formattedHoursToTwoNumber = durationInHours > 9 ? durationInHours : `0${durationInHours}`;
    const formattedMinutesToTwoNumber = durationInMinutes > 9 ? durationInMinutes : `0${durationInMinutes}`;

    const formattedDays = durationInDays ? formattedDaysToTwoNumber : '00';
    const formattedHours = durationInHours ? formattedHoursToTwoNumber : '00';
    const formattedMinutes = durationInMinutes ? formattedMinutesToTwoNumber : '00';

    if (durationInDays > 0) {
      return `${formattedDays}D ${formattedHours}H ${formattedMinutes}M`;
    } else if (durationInHours > 0) {
      return `${formattedHours}H ${formattedMinutes}M`;
    } else if (durationInMinutes > 0) {
      return `${formattedMinutes}M`;
    }
  }

  return '';
};

const isDatesEqual = (dateA, dateB) => (dateA === null && dateB === null) || dayjs(dateA).isSame(dateB, 'minute');

const isOffersEqual = (offersA, offersB) => offersA.length === offersB.length &&
  !getArraysDifference(offersA, offersB).length;

const findOffersByType = (offersByAllTypes, type) => offersByAllTypes.find((offer) => offer.type === type).offers;

const findDestinationByName = (allDestinations, name) => allDestinations.find((destination) => destination.name === name);

const calculateTotalCostForPoint = (basePrice, selectedOffers) => basePrice + selectedOffers.reduce((total, offer) => total + offer.price, 0);

export {
  humanizePointDate,
  humanizePointDateForAttribute,
  humanizePointTime,
  humanizePointTimeForAttribute,
  humanizePointDateTime,
  getDuration,
  humanizeDuration,
  isDatesEqual,
  isOffersEqual,
  findOffersByType,
  findDestinationByName,
  calculateTotalCostForPoint
};
