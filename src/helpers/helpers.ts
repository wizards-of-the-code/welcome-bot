export const hasObjectKey = (obj: unknown, key: string): boolean => {
  if (obj instanceof Object) {
    return Object.prototype.hasOwnProperty.call(obj, key);
  }
  return false;
};

export const getAndDeleteItemFromArr = <T>(index: number, array: T[]): T => {
  const item = array[index];
  array.splice(index, 1);
  return item;
};


