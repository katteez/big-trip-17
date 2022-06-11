const getArraysDifference = (arrayA, arrayB) => arrayA.filter((item) => !arrayB.includes(item))
  .concat(arrayB.filter((item)=> !arrayA.includes(item)));

const isEscKeyDown = (evt) => evt.key === 'Escape' || evt.key === 'Esc';

export { getArraysDifference, isEscKeyDown };
