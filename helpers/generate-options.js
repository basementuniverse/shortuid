const BigNumber = require('../node_modules/bignumber.js/bignumber.js');

const PRIME_DIGITS = 10;
const BASE_DIGITS = 12;
const MIXER_DIGITS = 20;

function generateLargeRandomInteger(digits) {
  let num = '';
  for (let i = 0; i < digits; i++) {
    num += Math.floor(Math.random() * 10);
  }
  return new BigNumber(num);
}

function generateLargePrime(digits, min = BigNumber(0)) {
  let num = generateLargeRandomInteger(digits);
  if (min.isGreaterThan(0)) {
    num = BigNumber.max(num, min);
  }
  while (!isPrime(num)) {
    num = num.plus(1);
  }
  return num;
}

function isPrime(n) {
  if (n.isLessThanOrEqualTo(1)) {
    return false;
  }
  if (n.isLessThanOrEqualTo(3)) {
    return true;
  }
  if (n.modulo(2).isEqualTo(0) || n.modulo(3).isEqualTo(0)) {
    return false;
  }
  for (
    let i = new BigNumber(5);
    i.multipliedBy(i).isLessThanOrEqualTo(n);
    i = i.plus(6)
  ) {
    if (n.modulo(i).isEqualTo(0) || n.modulo(i.plus(2)).isEqualTo(0)) {
      return false;
    }
  }
  return true;
}

function gcd(a, b) {
  if (b.isEqualTo(0)) {
    return a;
  }
  return gcd(b, a.modulo(b));
}

function isCoprime(a, b) {
  return gcd(a, b).isEqualTo(1);
}

function findPrimeCoprimeToB(b, digits) {
  let p = generateLargePrime(digits);
  while (!isPrime(p) || !isCoprime(p, b)) {
    p = generateLargePrime(digits, p.plus(1));
  }
  return p;
}

function findMultiplicativeModularInverseOfPrimeModuloBase(prime, base) {
  let [g, x] = extendedGcd(prime, base);
  if (!g.isEqualTo(1)) {
    return null;
  }
  return (x.modulo(base).plus(base)).modulo(base);
}

function extendedGcd(a, b) {
  if (b.isEqualTo(0)) {
    return [a, new BigNumber(1), new BigNumber(0)];
  }
  let [g, x1, y1] = extendedGcd(b, a.modulo(b));
  let x = y1;
  let y = x1.minus(a.dividedBy(b).integerValue().multipliedBy(y1));
  return [g, x, y];
}

// Example usage:
const BASE = generateLargeRandomInteger(BASE_DIGITS);
const PRIME = findPrimeCoprimeToB(BASE, PRIME_DIGITS);
const INVERSE = findMultiplicativeModularInverseOfPrimeModuloBase(PRIME, BASE);
const MIXER = generateLargeRandomInteger(MIXER_DIGITS);

console.log(
  `Prime: ${PRIME}, Base: ${BASE}, Inverse: ${INVERSE}, Mixer: ${MIXER}`
);
