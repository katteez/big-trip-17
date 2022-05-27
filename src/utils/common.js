const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const updateItemInArray = (items, updatedItem) => {
  const updatedItemIndex = items.findIndex((item) => item.id === updatedItem.id);

  if (updatedItemIndex === -1) {
    return items;
  }

  return [
    ...items.slice(0, updatedItemIndex),
    updatedItem,
    ...items.slice(updatedItemIndex + 1),
  ];
};

export { getRandomInteger, updateItemInArray };

