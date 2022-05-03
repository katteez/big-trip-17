import { getRandomInteger } from '../utils.js';
import { DESTINATIONS, SENTENCES } from '../const.js';

const generateDescription = () => {
  const sentencesQuantity = getRandomInteger(1, 5);

  const getRandomSentence = () => SENTENCES[getRandomInteger(0, SENTENCES.length - 1)];

  return Array.from({length: sentencesQuantity}, getRandomSentence).join(' ');
};

const generateCity = () => {
  const randomIndex = getRandomInteger(0, DESTINATIONS.length - 1);

  return DESTINATIONS[randomIndex];
};

const generatePictures = () => {
  const picturesQuantity = 5;

  const getRandomPictureSrc = () => `http://picsum.photos/248/152?r=${getRandomInteger(0, 500)}`;

  // Берем из рандомного предложения первые 20 символов для описания картинки
  const getRandomDescription = () => SENTENCES[getRandomInteger(0, SENTENCES.length - 1)].slice(0, 20);

  const getPicture = () => ({
    src: getRandomPictureSrc(),
    description: getRandomDescription(),
  });

  return Array.from({length: picturesQuantity}, getPicture);
};

export const generateDestination = () => ({
  description: generateDescription(),
  name: generateCity(),
  pictures: generatePictures(),
});
