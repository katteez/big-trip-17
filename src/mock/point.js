import { getRandomInteger } from '../utils.js';
import dayjs from 'dayjs';
import { TYPES } from '../const.js';
import { generateDestination } from './destination.js';

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
  const randomIndex = getRandomInteger(0, TYPES.length - 1);

  return TYPES[randomIndex];
};

let type = null;

const generateOffersByType = (offersByAllTypes) => {
  const randomOffers = [];
  const randomOffersQuantity = getRandomInteger(1, 3);

  for (const offersByOneType of offersByAllTypes) {
    // Получаем только те доп. опции, которые подходят под тип текущей точки маршрута
    if (offersByOneType.type === type && offersByOneType.offers && offersByOneType.offers.length) {

      // Получаем массив с неповторяющимися доп. опциями
      while (randomOffers.length < randomOffersQuantity) {
        const randomOffer = offersByOneType.offers[getRandomInteger(0, offersByOneType.offers.length - 1)];

        if (randomOffers.indexOf(randomOffer) === -1) {
          randomOffers.push(randomOffer);
        }
      }
    }
  }

  return randomOffers;
};

export const generatePoint = (offersByAllTypes) => {
  dateFrom = generateDateFrom();
  type = generateType();

  return {
    basePrice: generatePrice(),
    dateFrom,
    dateTo: generateDateTo(),
    destination: generateDestination(),
    id: '0',
    isFavorite: Boolean(getRandomInteger(0, 1)),
    offers: generateOffersByType(offersByAllTypes),
    type,
  };
};
