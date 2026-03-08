import { last } from '@rnacanvas/utilities';

/**
 * Returns the previous item in the array, cycling to the last item if necessary.
 *
 * Throws for empty arrays.
 */
export function previous<T>(item: T, array: T[]): T | never {
  if (array.length == 0) {
    throw new Error('The array is empty.');
  }

  let i = array.indexOf(item);

  if (i < 0 || i >= array.length) {
    // just return the last item
    return last(array);
  }

  if (i == 0) {
    return last(array);
  }

  return array[i - 1];
}
