# Short UID

Generate short unique IDs.

## Installation

```
npm install -g @basementuniverse/shortuid
```

## Usage

```typescript
import { encode, decode } from '@basementuniverse/shortuid';

const numericId = 1;
const encodedShortId = encode(numericId);
// encodedShortId will be a short id string, similar to 'f85k8'

const decodedNumericId = decode(encodedShortId);
console.assert(decodedNumericId === numericId);
```

You will need the following variables inside your `.env` file:

```bash
# This should be a large prime number, coprime to BASE
# Try using https://primes.utm.edu/curios/index.php to find a suitable prime
PRIME=

# This should be a large integer
# It will define the size of the input domain, i.e. any inputs larger than BASE will result in duplicate ids
# Try using https://codinglab.huostravelblog.com/math/coprime-finder/index.php to find coprimes of PRIME
BASE=

# The multiplicative modular inverse of PRIME modulo BASE
# Try using https://planetcalc.com/3311/ to find this value
INVERSE=

# A large random number used to mix the output and add more entropy
# It must be larger than BASE
MIXER=

# A string containing all the characters that you want to see in the output
# Try using shuffled alphanumeric characters to add more entropy
# You may also wish to remove some hard-to-distinguish characters ('i', 'l', '1', '0', 'o' etc.)
ALPHA=
```

This might be helpful for generating a shuffled alphabet:

```javascript
'abcdefghijklmnopqrstuvwxyz123456789'
  .split('')
  .map(a => ({ sort: Math.random(), value: a }))
  .sort((a, b) => a.sort - b.sort)
  .map(a => a.value).join('')
```

_Note: see `.env.example` for sample values._
