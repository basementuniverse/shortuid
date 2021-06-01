import BigNumber from 'bignumber.js';
import * as dotenv from 'dotenv-flow';

dotenv.config();

const getEnv = (k: string): string => {
  if (k in process.env) {
    return process.env[k];
  }
  throw new Error(`.env variable ${k} not found`);
};

const prime = new BigNumber(getEnv('PRIME'));
const base = new BigNumber(getEnv('BASE'));
const inverse = new BigNumber(getEnv('INVERSE'));
const mixer = new BigNumber(getEnv('MIXER'));
const alpha = getEnv('ALPHA');
const alphaBase = new BigNumber(alpha.length);

/**
 * Encode an integer as a short unique ID string
 * @param {number} i The number to encode
 * @returns {string} The short unique ID string
 */
export function encode(i: number): string {
  return encode2(encode1(i));
}

/**
 * Decode an ID string into an integer
 * @param {string} id The ID string to decode
 * @returns {number} The decoded integer
 */
export function decode(id: string): number {
  return decode2(decode1(id));
}

/**
 * Should permutate the domain such that each unique input gives us a big unique random-looking output
 * y = (a * x + m) % b
 * @param {number} i
 * @returns {BigNumber}
 */
function encode1(i: number): BigNumber {
  return prime.multipliedBy(i).plus(mixer).modulo(base);
}

/**
 * Convert a decimal number into a base N number, where N is the length of our custom alphabet
 * @param {BigNumber} i
 * @returns {string}
 */
function encode2(i: BigNumber): string {
  let result = '';
  while (i.isGreaterThan(0)) {
    const remainder = i.modulo(alphaBase);
    i = i.minus(remainder).dividedBy(alphaBase);
    result += alpha[remainder.toNumber()];
  }
  return result;
}

/**
 * Convert a base N number (where N is the length of our custom alphabet) into a decimal number
 * @param {string} id
 * @returns {BigNumber}
 */
function decode1(id: string): BigNumber {
  let result = new BigNumber(0);
  for (let i = id.length; i--;) {
    result = result.plus(new BigNumber(alpha.indexOf(id[i])).multipliedBy(alphaBase.exponentiatedBy(i)));
  }
  return result;
}

/**
 * Performs inverse of encode1
 * x = b + ((y - m) * a') % b
 * @param {BigNumber} i
 * @returns {number}
 */
function decode2(i: BigNumber): number {
  return i.minus(mixer).multipliedBy(inverse).modulo(base).plus(base).toNumber();
}
