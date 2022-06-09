const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PAST: 'past',
};

const SortType = {
  DAY: {
    value: 'day',
    name: 'Day',
    isDisabled: false,
  },
  EVENT: {
    value: 'event',
    name: 'Event',
    isDisabled: false,
  },
  TIME: {
    value: 'time',
    name: 'Time',
    isDisabled: false,
  },
  PRICE: {
    value: 'price',
    name: 'Price',
    isDisabled: false,
  },
  OFFERS: {
    value: 'offers',
    name: 'Offers',
    isDisabled: true,
  },
};

const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

export { FilterType, SortType, UserAction, UpdateType };
