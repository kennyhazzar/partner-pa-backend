import { CODE_ALPHABET } from '../constants';

export const getRandomCode = (
  length: number = 6,
  alphabet: string = CODE_ALPHABET,
): string => {
  let result = '';
  const alphabetLength = alphabet.length;

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * alphabetLength);
    result += alphabet[randomIndex];
  }

  return result;
};
