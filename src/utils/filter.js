import dayjs from 'dayjs';
import { FilterType } from '../const.js';

const isDateSameToCurrentDate = (date) => dayjs(date).isSame(dayjs(), 'minute');

const isDateInFuture = (date) => dayjs(date).isAfter(dayjs(), 'minute');

const isDateInPast = (date) => dayjs(date).isBefore(dayjs(), 'minute');

const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => isDateSameToCurrentDate(point.dateFrom) || isDateInFuture(point.dateFrom)
    || isDateInPast(point.dateFrom) && isDateInFuture(point.dateTo)),
  [FilterType.PAST]: (points) => points.filter((point) => isDateInPast(point.dateTo)
    || isDateInPast(point.dateFrom) && isDateInFuture(point.dateTo)),
};

export {
  isDateSameToCurrentDate,
  isDateInFuture,
  isDateInPast,
  filter
};
