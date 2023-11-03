import Shortuid from '.';

const COUNT = 1000;

const options = {
  prime: 139,
  base: 1000,
  inverse: 259,
  mixer: 2000,
  alpha: '0123456789',
};

test('Encode produces outputs that can be decoded back to the original value', () => {
  for (let i = 1; i < COUNT; i++) {
    const encoded = Shortuid.encode(i, options);
    const decoded = Shortuid.decode(encoded, options);
    expect(decoded).toBe(i);
  }
});

test('Encode produces unique outputs', () => {
  const seen: { [k: string]: boolean } = {};
  let collision = false;
  for (let i = 1; i < COUNT; i++) {
    const encoded = Shortuid.encode(i, options);
    if (seen[encoded]) {
      collision = true;
      break;
    }
    seen[encoded] = true;
  }
  expect(collision).toBe(false);
});
