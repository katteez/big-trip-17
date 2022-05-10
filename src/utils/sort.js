import { SortType } from '../const.js';
import { getDuration } from './point.js';

const sort = {
  [SortType.DAY]: (points) => points.slice().sort((a, b) => a.dateFrom - b.dateFrom),
  [SortType.TIME]: (points) => points.slice().sort((a, b) => getDuration(b.dateTo, b.dateFrom) - getDuration(a.dateTo, a.dateFrom)),
  [SortType.PRICE]: (points) => points.slice().sort((a, b) => b.basePrice - a.basePrice),
};

export { sort };
