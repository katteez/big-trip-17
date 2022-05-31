import dayjs from 'dayjs';
import { getDuration } from './point.js';

// Помещает точки маршрута без даты в конец списка
const getWeightForNullDate = (dateA, dateB) => {
  if (dateA === null && dateB === null) {
    return 0;
  }

  if (dateA === null) {
    return 1;
  }

  if (dateB === null) {
    return -1;
  }

  return null;
};

const sortDayUp = (pointA, pointB) => {
  const weight = getWeightForNullDate(pointA.dateFrom, pointB.dateFrom);

  return weight ?? dayjs(pointA.dateFrom).diff(dayjs(pointB.dateFrom));
};

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
