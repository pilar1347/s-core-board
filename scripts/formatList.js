const fs = require('fs');

const filePath = './public/words/car.txt';

const file = fs.readFileSync(filePath, 'utf-8');

const updated = file.split('\n').map(word => {
  return word.toUpperCase();
}).filter(Boolean).sort().join('\n');

const makeUnique = (arr) => {
  return [...new Set(arr)];
};
const final = makeUnique(updated.split('\n')).join('\n');

fs.writeFileSync(filePath, final);


