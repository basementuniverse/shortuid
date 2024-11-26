# Short UID

Generate short unique IDs from sequential numbers.

The short unique IDs can be converted back to the original sequential numbers.

This can be useful when you have an auto-increment ID column in your database, but you want to show a short alpha-numeric ID to users.

With this package you can convert sequential numbers to random-looking ID strings and back again.

## Installation

```
npm install -g @basementuniverse/shortuid
```

## Usage

```typescript
import Shortuid, { ShortuidOptions } from '@basementuniverse/shortuid';

const options: ShortuidOptions = {
  // This should be a large prime number, coprime to base
  // Try using https://primes.utm.edu/curios/index.php to find a suitable prime
  prime: '6345796823',

  // This should be a large integer
  // It will define the size of the input domain, i.e. any inputs larger than base will result in duplicate ids
  // Try using https://codinglab.huostravelblog.com/math/coprime-finder/index.php to find coprimes of prime
  base: '10212011',

  // The multiplicative modular inverse of prime modulo base
  // Try using https://planetcalc.com/3311/ to find this value
  inverse: '3736125',

  // A large random number used to mix the output and add more entropy
  // It must be larger than base
  mixer: '28737113',

  // A string containing all the characters that you want to see in the output
  // Try using shuffled alphanumeric characters to add more entropy
  // You may also wish to remove some hard-to-distinguish characters ('i', 'l', '1', '0', 'o' etc.)
  alpha: '568vhgxrwkfjyn9d3pc2mqbaz74set',
};

const numericId = 1;
const encodedShortId = Shortuid.encode(numericId, options);
// encodedShortId will be a short id string, similar to 'f85k8'

const decodedNumericId = Shortuid.decode(encodedShortId, options);
console.assert(decodedNumericId === numericId);
```

Some helper scripts are provided which might be useful for generating options:

```bash
cd helpers

# Generate prime, base, inverse and mixer:
node generate-options.js

# Generate a random alphabet:
node generate-alphabet.js

# Check for collisions:
node check-collisions.js
```
