import { encode, decode } from './index';

const COUNT = 1000;

test('Encode produces outputs that can be decoded back to the original value', () => {
  for (let i = 1; i < COUNT; i++) {
    const encoded = encode(i);
    const decoded = decode(encoded);
    expect(decoded).toBe(i);
  }
});

test('Encode produces unique outputs', () => {
  const seen: { [k: string]: boolean } = {};
  let collision = false;
  for (let i = 1; i < COUNT; i++) {
    const encoded = encode(i);
    if (seen[encoded]) {
      collision = true;
      break;
    }
    seen[encoded] = true;
  }
  expect(collision).toBe(false);
});
