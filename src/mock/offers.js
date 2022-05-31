import { getRandomInteger } from '../utils/common.js';
import { TYPES } from '../const.js';

const generateOffersByAllTypes = () => {
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
      'id': 6,
      'title': 'Add breakfast',
      'price': 60
    }, {
      'id': 7,
      'title': 'Book tickets',
      'price': 40
    }, {
      'id': 8,
      'title': 'Lunch in city',
      'price': 30
    }, {
      'id': 9,
      'title': 'Add meal',
      'price': 15
    }, {
      'id': 10,
      'title': 'Choose seats',
      'price': 5
    }, {
      'id': 11,
      'title': 'Travel by train',
      'price': 40
    },
  ];

  const offersByAllTypes = [];

  for (const type of TYPES) {
    const hasOffers = Boolean(getRandomInteger(0, 1));
    const randomOffers = [];

    if (hasOffers) {
      const randomOffersQuantity = getRandomInteger(1, 5);

      // Получаем массив с неповторяющимися доп. опциями
      while (randomOffers.length < randomOffersQuantity) {
        const randomOffer = offers[getRandomInteger(0, offers.length - 1)];

        if (randomOffers.indexOf(randomOffer) === -1) {
          randomOffers.push(randomOffer);
        }
      }
    }

    const offersByOneType = {
      type,
      offers: randomOffers,
    };

    offersByAllTypes.push(offersByOneType);
  }

  return offersByAllTypes;
};

export const generatedOffersByAllTypes = generateOffersByAllTypes();
