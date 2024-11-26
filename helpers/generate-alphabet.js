const ALPHABET = 'abcdefghjkmnpqrstwxyz123456789';

function shuffle(a) {
  let i = a.length;
  while (i !== 0) {
    const j = Math.floor(Math.random() * i);
    i--;
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

console.log(
  shuffle(ALPHABET.split('')).join('')
);
