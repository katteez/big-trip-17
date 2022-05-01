import { getRandomInteger } from '../utils.js';

export const generateOffers = () => {
  const types = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

  const offers = [
    {
      'id': 1,
      'title': 'Upgrade to a business class',
      'price': 120
    }, {
      'id': 2,
      'title': 'Order Uber',
      'price': 20
    }, {
      'id': 3,
      'title': 'Add luggage',
      'price': 50
    }, {
      'id': 4,
      'title': 'Switch to comfort',
      'price': 80
    }, {
      'id': 5,
      'title': 'Rent a car',
      'price': 200
    }, {
      'id': 5,
      'title': 'Add breakfast',
      'price': 60
    }, {
      'id': 6,
      'title': 'Book tickets',
      'price': 40
    }, {
      'id': 7,
      'title': 'Lunch in city',
      'price': 30
    },
  ];

  const offersByType = [];

  for (const type of types) {
    const areOffers = Boolean(getRandomInteger(0, 1));
    const randomOffers = [];

    if (areOffers) {
      const offersQuantity = getRandomInteger(1, 3);

      // Получаем массив с неповторяющимися доп. опциями
      while (randomOffers.length < offersQuantity) {
        const randomOffer = offers[getRandomInteger(0, offers.length - 1)];

        if (randomOffers.indexOf(randomOffer) === -1) {
          randomOffers.push(randomOffer);
        }
      }
    }

    const offerByType = {
      type,
      offers: randomOffers,
    };

    offersByType.push(offerByType);
  }

  return offersByType;
};
