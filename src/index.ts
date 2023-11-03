import BigNumber from 'bignumber.js';

export type ShortuidOptions = {
  /**
   * a: large prime number, coprime to b
   *
   * https://primes.utm.edu/curios/index.php
   */
  prime: string | number;

  /**
   * b: defines the domain size
   *
   * inputs larger than b will loop around and cause collisions
   *
   * https://codinglab.huostravelblog.com/math/coprime-finder/index.php
   */
  base: string | number;

  /**
   * a^-1: multiplicative modular inverse of a, i.e. (a * a^-1) % b = 1
   *
   * https://planetcalc.com/3311/
   */
  inverse: string | number;

  /**
   * m: large random number, must be >= b
   */
  mixer: string | number;

  /**
   * The alphabet to use in the resulting id
   */
  alpha: string;
};

type ShortuidInternalOptions = {
  prime: BigNumber;
  base: BigNumber;
  inverse: BigNumber;
  mixer: BigNumber;
  alpha: string;
  alphaBase: BigNumber;
};

const defaultOptions: ShortuidOptions = {
  prime: '6345796823',
  base: '10212011',
  inverse: '3736125',
  mixer: '28737113',
  alpha: '568vhgxrwkfjyn9d3pc2mqbaz74set',
};

export default class Shortuid {
  /**
   * Encode an integer as a short unique ID string
   * @param {number} i The number to encode
   * @returns {string} The short unique ID string
   */
  public static encode(i: number, options: ShortuidOptions = defaultOptions): string {
    const internalOptions = this.parseOptions(options);
    return this.encode2(this.encode1(i, internalOptions), internalOptions);
  }

  /**
   * Decode an ID string into an integer
   * @param {string} id The ID string to decode
   * @returns {number} The decoded integer
   */
  public static decode(id: string, options: ShortuidOptions = defaultOptions): number {
    const internalOptions = this.parseOptions(options);
    return this.decode2(this.decode1(id, internalOptions), internalOptions);
  }

  private static parseOptions(options: ShortuidOptions): ShortuidInternalOptions {
    return {
      prime: new BigNumber(options.prime),
      base: new BigNumber(options.base),
      inverse: new BigNumber(options.inverse),
      mixer: new BigNumber(options.mixer),
      alpha: options.alpha,
      alphaBase: new BigNumber(options.alpha.length),
    };
  }

  /**
   * Should permutate the domain such that each unique input gives us a big unique
   * random-looking output
   *
   * y = (a * x + m) % b
   *
   * @param {number} i
   * @returns {BigNumber}
   */
  private static encode1(i: number, options: ShortuidInternalOptions): BigNumber {
    return options.prime
      .multipliedBy(i)
      .plus(options.mixer)
      .modulo(options.base);
  }

  /**
   * Convert a decimal number into a base N number, where N is the length of our
   * custom alphabet
   *
   * @param {BigNumber} i
   * @returns {string}
   */
  private static encode2(i: BigNumber, options: ShortuidInternalOptions): string {
    let result = '';
    while (i.isGreaterThan(0)) {
      const remainder = i.modulo(options.alphaBase);
      i = i.minus(remainder).dividedBy(options.alphaBase);
      result += options.alpha[remainder.toNumber()];
    }
    return result;
  }

  /**
   * Convert a base N number (where N is the length of our custom alphabet) into a
   * decimal number
   *
   * @param {string} id
   * @returns {BigNumber}
   */
  private static decode1(id: string, options: ShortuidInternalOptions): BigNumber {
    let result = new BigNumber(0);
    for (let i = id.length; i--;) {
      result = result
        .plus(new BigNumber(options.alpha.indexOf(id[i]))
        .multipliedBy(options.alphaBase.exponentiatedBy(i)));
    }
    return result;
  }

  /**
   * Performs inverse of encode1
   *
   * x = b + ((y - m) * a') % b
   *
   * @param {BigNumber} i
   * @returns {number}
   */
  private static decode2(i: BigNumber, options: ShortuidInternalOptions): number {
    return i
      .minus(options.mixer)
      .multipliedBy(options.inverse)
      .modulo(options.base)
      .plus(options.base)
      .toNumber();
  }
}
