const fs = require('fs-extra');
const readline = require('node:readline');
const { stdin: input, stdout: output } = require('node:process');

// prompt each word in file and enter anything to keep or n to toss
// saves audited list in new file

const audit = n => {
  const filePath = `./public/words/${n}.txt`;

  const file = fs.readFileSync(filePath, 'utf-8');

  const wordList = file.split('\n').filter(Boolean).sort();

  const final = [];

  const rl = readline.createInterface({ input, output });

  const saveFile = () =>
    fs.writeFileSync(`./public/words/${n}-audited.txt`, final.join('\n'));

  const getInput = (i) => {
    const word = wordList[i];
    rl.question(word, answer => {
      if (answer.toLowerCase() !== 'n') {
        final.push(word);
      }
      if (answer.toLowerCase() === 's') {
        saveFile();
      }
      i += 1;

      if (i < wordList.length) {
        getInput(i);
      } else {
        saveFile();
        rl.close();
        process.exit(0);
      }
    });
  }

  getInput(0);
}

audit(3);
