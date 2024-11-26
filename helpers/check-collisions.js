const BigNumber = require('../node_modules/bignumber.js/bignumber.js');
const Shortuid = require('../build/index.js').default;
const { BloomFilter } = require('../node_modules/bloom-filters');

const PRIME = new BigNumber('5507309281');
const BASE = new BigNumber('238953644832');
const INVERSE = new BigNumber('169292861079');
const MIXER = new BigNumber('66269000278849001204');
const ALPHA = 's67tzy18j2nk3mdec5qbgw9hxafpr4';

const N = 100000000;
const P = 1E-8;

function findCollisionsUsingMap() {
  const m = new Map();
  let n = 0;
  for (let i = 0; i < N; i++) {
    if (n++ >= 1000000) {
      process.stdout.write('.');
      n = 0;
    }
    const id = Shortuid.encode(i, {
      prime: PRIME,
      base: BASE,
      inverse: INVERSE,
      mixer: MIXER,
      alpha: ALPHA,
    });
    if (m.has(id)) {
      throw new Error(`Collision found: ${i}:${id} and ${m.get(id)}:${id}`);
    }
    m.set(id, i);
  }
}

function findCollisionsUsingBloomFilter() {
  const bits = Math.ceil((N * Math.log(P)) / Math.log(1 / Math.pow(2, Math.log(2))));
  const hashes = Math.round((bits / N) * Math.log(2));
  const filter = new BloomFilter(bits, hashes);
  let n = 0;
  for (let i = 0; i < N; i++) {
    if (n++ >= 1000000) {
      process.stdout.write('.');
      n = 0;
    }
    const id = Shortuid.encode(i, {
      prime: PRIME,
      base: BASE,
      inverse: INVERSE,
      mixer: MIXER,
      alpha: ALPHA,
    });
    if (filter.has(id)) {
      throw new Error(`Collision found: ${i}:${id}`);
    }
    filter.add(id);
  }
}

console.log('Sample UIDs:');
for (let i = 0; i < 5; i++) {
  console.log(Shortuid.encode(i, {
    prime: PRIME,
    base: BASE,
    inverse: INVERSE,
    mixer: MIXER,
    alpha: ALPHA,
  }));
}

if (N <= 10000000) {
  console.log('Using MAP');
  findCollisionsUsingMap();
} else {
  console.log('Using BLOOM FILTER');
  findCollisionsUsingBloomFilter();
}
console.log('\nNo collisions found');
