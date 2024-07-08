import { CODE_ALPHABET } from '../constants';

export const getRandomCode = (
  length: number = 6,
  alphabet: string = CODE_ALPHABET,
): string =>
  Array.from({ length }, () =>
    alphabet.charAt(Math.floor(Math.random() * alphabet.length)),
  ).join('');
