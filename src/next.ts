import { first } from '@rnacanvas/utilities';

/**
 * Returns the next item in the array, cycling back to the first item if necessary.
 *
 * Throws for empty arrays.
 */
export function next<T>(item: T, array: T[]): T | never {
  if (array.length == 0) {
    throw new Error('The array is empty.');
  }

  let i = array.indexOf(item);

  if (i < 0 || i >= array.length) {
    // just return the first item
    return first(array);
  }

  if (i == array.length - 1) {
    return first(array);
  }

  return array[i + 1];
}
