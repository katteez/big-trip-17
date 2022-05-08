import dayjs from 'dayjs';

const humanizePointDate = (date) => date ? dayjs(date).format('MMM DD') : '';
const humanizePointDateForAttribute = (date) => date ? dayjs(date).format('YYYY-MM-DD') : '';

const humanizePointTime = (date) => date ? dayjs(date).format('HH:mm') : '';
const humanizePointTimeForAttribute = (date) => date ? dayjs(date).format('YYYY-MM-DDTHH:mm') : '';

const humanizePointDateTime = (date) => date ? dayjs(date).format('DD/MM/YY HH:mm') : '';

const getDuration = (dateTo, dateFrom) => dateTo && dateFrom ? dayjs(dateTo).diff(dayjs(dateFrom)) : '';

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
  humanizePointDate,
  humanizePointDateForAttribute,
  humanizePointTime,
  humanizePointTimeForAttribute,
  humanizePointDateTime,
  getDuration,
  humanizeDuration
};