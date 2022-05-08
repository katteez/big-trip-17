import dayjs from 'dayjs';

const humanizeTripDates = (dateFrom, dateTo) => {
  const startMonth = dayjs(dateFrom).format('MMM');
  const endMonth = dayjs(dateTo).format('MMM');

  if (startMonth === endMonth) {
    return `${dayjs(dateFrom).format('MMM DD')} &nbsp;&mdash;&nbsp; ${dayjs(dateTo).format('DD')}`;
  }

  return `${dayjs(dateFrom).format('MMM DD')} &nbsp;&mdash;&nbsp; ${dayjs(dateTo).format('MMM DD')}`;
};

export { humanizeTripDates };
