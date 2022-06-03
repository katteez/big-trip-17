import dayjs from 'dayjs';

const humanizeTripDates = (dateFrom, dateTo) => {
  const startMonth = dayjs(dateFrom).format('MMM');
  const endMonth = dayjs(dateTo).format('MMM');

  if (startMonth === endMonth) {
    return `${dayjs(dateFrom).format('MMM DD')} &nbsp;&mdash;&nbsp; ${dayjs(dateTo).format('DD')}`;
  }

  return `${dayjs(dateFrom).format('MMM DD')} &nbsp;&mdash;&nbsp; ${dayjs(dateTo).format('MMM DD')}`;
};

const MAX_DESTINATIONS_COUNT = 3;

const getTripTitle = (destinations) => destinations.length <= MAX_DESTINATIONS_COUNT
  ? destinations.join(' &mdash; ')
  : `${destinations[0]} &mdash;... &mdash; ${destinations[destinations.length-1]}`;

export { humanizeTripDates, getTripTitle };
