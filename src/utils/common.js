const getArraysDifference = (arrayA, arrayB) => arrayA.filter((item) => !arrayB.includes(item))
  .concat(arrayB.filter((item)=> !arrayA.includes(item)));

export { getArraysDifference };
