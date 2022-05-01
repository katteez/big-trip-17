import dayjs from 'dayjs';

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const humanizePointDate = (date) => dayjs(date).format('MMM DD');
const humanizePointDateForAttribute = (date) => dayjs(date).format('YYYY-MM-DD');

const humanizePointTime = (date) => dayjs(date).format('HH:mm');
const humanizePointTimeForAttribute = (date) => dayjs(date).format('YYYY-MM-DDTHH:mm');

const humanizePointDateTime = (dateFrom) => dayjs(dateFrom).format('DD/MM/YY HH:mm');

const humanizeTripDates = (dateFrom, dateTo) => {
  const startMonth = dayjs(dateFrom).format('MMM');
  const endMonth = dayjs(dateTo).format('MMM');

  if (startMonth === endMonth) {
    return `${dayjs(dateFrom).format('MMM DD')} &nbsp;&mdash;&nbsp; ${dayjs(dateTo).format('DD')}`;
  }

  return `${dayjs(dateFrom).format('MMM DD')} &nbsp;&mdash;&nbsp; ${dayjs(dateTo).format('MMM DD')}`;
};

const getDuration = (dateTo, dateFrom) => dayjs(dateTo).diff(dayjs(dateFrom));

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

export {
  getRandomInteger,
  humanizePointDate,
  humanizePointDateForAttribute,
  humanizePointTime,
  humanizePointTimeForAttribute,
  humanizePointDateTime,
  humanizeTripDates,
  getDuration,
  humanizeDuration
};
