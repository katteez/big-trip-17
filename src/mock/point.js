import dayjs from 'dayjs';
import { nanoid } from 'nanoid';
import { getRandomInteger } from '../utils/common.js';
import { TYPES } from '../const.js';
import { generateDestination } from './destination.js';

const generatePrice = () => getRandomInteger(10, 1500);

const maxHoursGap = 23;
const maxMinutesGap = 59;

const generateDateFrom = () => {
  const maxDaysGap = 30;

  const daysGap = getRandomInteger(-maxDaysGap, maxDaysGap);
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

const generateOfferIds = (offersByAllTypes) => {
  const randomOfferIds = [];

  // Получаем только те доп. опции, которые подходят под тип текущей точки маршрута
  const offersByPointType = offersByAllTypes.find((offer) => offer.type === type).offers;

  if (offersByPointType && offersByPointType.length) {
    for (const offer of offersByPointType) {
      const isNecessaryToAdd = Boolean(getRandomInteger(0, 1));

      // Рандомно добавляем id некоторых опций в опции точки маршрута
      if(isNecessaryToAdd) {
        randomOfferIds.push(offer.id);
      }
    }
  }

  return randomOfferIds;
};

export const generatePoint = (offersByAllTypes) => {
  dateFrom = generateDateFrom();
  type = generateType();

  return {
    basePrice: generatePrice(),
    dateFrom,
    dateTo: generateDateTo(),
    destination: generateDestination(),
    id: nanoid(),
    isFavorite: Boolean(getRandomInteger(0, 1)),
    offers: generateOfferIds(offersByAllTypes),
    type,
  };
};
