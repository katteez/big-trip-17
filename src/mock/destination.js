import { getRandomInteger } from '../utils.js';
import { DESTINATIONS } from '../const.js';

const generateDescription = () => {
  const sentences = [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    'Cras aliquet varius magna, non porta ligula feugiat eget.',
    'Fusce tristique felis at fermentum pharetra.',
    'Aliquam id orci ut lectus varius viverra.',
    'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
    'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
    'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
    'Sed sed nisi sed augue convallis suscipit in sed felis.',
    'Aliquam erat volutpat.',
    'Nunc fermentum tortor ac porta dapibus.',
    'In rutrum ac purus sit amet tempus.',
  ];

  const sentencesQuantity = getRandomInteger(1, 5);

  const getRandomSentence = () => sentences[getRandomInteger(0, sentences.length - 1)];

  return Array.from({length: sentencesQuantity}, getRandomSentence).join(' ');
};

const generateCity = () => {
  const randomIndex = getRandomInteger(0, DESTINATIONS.length - 1);

  return DESTINATIONS[randomIndex];
};

const generatePictures = () => {
  const randomIndex = getRandomInteger(0, 500);

  return `http://picsum.photos/248/152?r=${randomIndex}`;
};

export const generateDestination = () => ({
  description: generateDescription(),
  name: generateCity(),
  pictures: generatePictures(),
});
