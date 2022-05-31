import { getRandomInteger } from '../utils/common.js';
import { DESTINATIONS, SENTENCES } from '../const.js';

const generateDescription = () => {
  const sentencesQuantity = getRandomInteger(1, 5);

  const getRandomSentence = () => SENTENCES[getRandomInteger(0, SENTENCES.length - 1)];

  return Array.from({length: sentencesQuantity}, getRandomSentence).join(' ');
};

const generatePictures = () => {
  const picturesQuantity = 5;
  const hasPictures = Boolean(getRandomInteger(0, 1));

  if (hasPictures) {
    const getRandomPictureSrc = () => `http://picsum.photos/248/152?r=${getRandomInteger(0, 500)}`;

    // Берем из рандомного предложения первые 20 символов для описания картинки
    const getRandomDescription = () => SENTENCES[getRandomInteger(0, SENTENCES.length - 1)].slice(0, 20);

    const getPicture = () => ({
      src: getRandomPictureSrc(),
      description: getRandomDescription(),
    });

    return Array.from({length: picturesQuantity}, getPicture);
  }

  return [];
};

export const generatedDestinations = DESTINATIONS.map((destination) => ({
  name: destination,
  description: `${destination} ${generateDescription()}`,
  pictures: generatePictures(),
}));
