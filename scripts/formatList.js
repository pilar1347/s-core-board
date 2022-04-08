const fs = require('fs');

const filePath = './public/words/5.txt';

const file = fs.readFileSync(filePath, 'utf-8');

const updated = file.split('\n').map(word => {
  return word.toUpperCase();
}).filter(Boolean).sort().join('\n');

fs.writeFileSync(filePath, updated);


