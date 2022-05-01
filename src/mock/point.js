import { getRandomInteger } from '../utils.js';
import dayjs from 'dayjs';
import { generateDestination } from './destination.js';
import { generateOffers } from './offers.js';

const generatePrice = () => getRandomInteger(10, 1500);

const maxHoursGap = 23;
const maxMinutesGap = 59;

const generateDateFrom = () => {
  const maxDaysGap = 30;

  const daysGap = getRandomInteger(0, maxDaysGap);
  const hoursGap = getRandomInteger(0, maxHoursGap);
  const minutesGap = getRandomInteger(0, maxMinutesGap);

  return dayjs().add(daysGap, 'day').add(hoursGap, 'hour').add(minutesGap, 'minute').toDate();
};

let dateFrom = null;

const generateDateTo = () => {
  const maxDaysGap = 1;

  const daysGap = getRandomInteger(0, maxDaysGap);
  const hoursGap = getRandomInteger(0, maxHoursGap);
  const minutesGap = getRandomInteger(0, maxMinutesGap);

  return dayjs(dateFrom).add(daysGap, 'day').add(hoursGap, 'hour').add(minutesGap, 'minute').toDate();
};

const generateType = () => {
  const types = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

  const randomIndex = getRandomInteger(0, types.length - 1);

  return types[randomIndex];
};

let type = null;

// Получаем только те доп. опции, которые подходят под тип точки маршрута
const generateOffersByType = () => {
  const offersByAllTypes = generateOffers();

  for (const offersByOneType of offersByAllTypes) {
    if (offersByOneType.type === type) {
      return offersByOneType.offers;
    }
  }
};

export const generatePoint = () => {
  dateFrom = generateDateFrom();
  type = generateType();

  return {
    basePrice: generatePrice(),
    dateFrom,
    dateTo: generateDateTo(),
    destination: generateDestination(),
    id: '0',
    isFavorite: Boolean(getRandomInteger(0, 1)),
    offers: generateOffersByType(),
    type,
  };
};
