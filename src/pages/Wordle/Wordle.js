import { useEffect, useState } from 'react';
import './Wordle.css';

const defaultKeyboard = [
  [
    { color: 'gray', letter: 'q' },
    { color: 'gray', letter: 'w' },
    { color: 'gray', letter: 'e' },
    { color: 'gray', letter: 'r' },
    { color: 'gray', letter: 't' },
    { color: 'gray', letter: 'y' },
    { color: 'gray', letter: 'u' },
    { color: 'gray', letter: 'i' },
    { color: 'gray', letter: 'o' },
    { color: 'gray', letter: 'p' }
  ],
  [
    { color: 'gray', letter: 'a' },
    { color: 'gray', letter: 's' },
    { color: 'gray', letter: 'd' },
    { color: 'gray', letter: 'f' },
    { color: 'gray', letter: 'g' },
    { color: 'gray', letter: 'h' },
    { color: 'gray', letter: 'j' },
    { color: 'gray', letter: 'k' },
    { color: 'gray', letter: 'l' }
  ],
  [
    { color: 'gray', letter: 'z' },
    { color: 'gray', letter: 'x' },
    { color: 'gray', letter: 'c' },
    { color: 'gray', letter: 'v' },
    { color: 'gray', letter: 'b' },
    { color: 'gray', letter: 'n' },
    { color: 'gray', letter: 'm' }
  ]
];

const findInKeys = (letter, color, keys) => {
  keys.forEach((row, i) => {
    row.forEach((item, j) => {
      if (item.letter.toUpperCase() === letter.toUpperCase()) {
        keys[i][j] = { letter, color }
      }
    })
  });
  return keys;
}

const Wordle = () => {
  const [guess, setGuess] = useState('');
  const [error, setError] = useState('');
  const [word, setWord] = useState([]);
  const [wordList, setWordList] = useState([]);
  const [boardData, setBoardData] = useState([]);
  const [keyboard, setKeyboard] = useState(defaultKeyboard);
  const [isWinner, setIsWinner] = useState(false);

  useEffect(() => {
    const fetchWords = async () => {
      fetch('./words/5.txt')
      .then(r => r.text())
      .then(text => {
        const words = text.split('\n');
        setWordList(words);
        const word = words[Math.floor(Math.random() * words.length)];
        setWord(word);
      })
    }
    fetchWords();
  }, []);

  const updateGuess = e => {
    if (error) {
      setError('');
    }
    setGuess(e.target.value);
  }

  const makeGuess = e => {
    e.preventDefault();
    const isWord = wordList.includes(guess.toLowerCase());
    const isValidGuess = /[a-zA-Z]{5}/.test(guess) && isWord;
    let newKeys = keyboard.slice();

    if (!isWord) {
      setError('Word not in word list.');
      return;
    }

    if (!isValidGuess) {
      setError('Guess in invalid. Try again.');
      return;
    }

    if (isValidGuess) {
      const result = guess.split('').map((letter, i) => {
        if (word[i].toUpperCase() === letter.toUpperCase()) {
          newKeys = findInKeys(letter, 'green', newKeys);
          return { color: 'green', letter };
        }
        if (word.toUpperCase().includes(letter.toUpperCase())) {
          newKeys = findInKeys(letter, 'yellow', newKeys);
          return { color: 'yellow', letter };
        }
        else {
          newKeys = findInKeys(letter, 'darkgray', newKeys);
          return { color: 'gray', letter }
        }
      });
      setBoardData([...boardData, result]);
      setKeyboard(newKeys);

      if (word.toUpperCase() === guess.toUpperCase()){
        setIsWinner(true);
      }

      setGuess('');
    }
  }

  const playAgain = () => {
    window.location.reload();
  }

  return (
    <div className="wordle">
      <p>Wordle</p>
      <div className="board-wrap">
        <div className="board">
          {boardData.map((row, i) => {
            return (
              <div className="row" key={`row-${i}`}>
                {row.map((item, j) => {
                  return (
                    <div key={`cell-${i}-${j}`} className={`cell ${item.color}`}>{item.letter}</div>
                  )
                })}
              </div>
            )
          })}
          {!isWinner ? (
            <>
              <div className="row">
                <form onSubmit={makeGuess}>
                  <input maxLength="5" type="text" value={guess} onChange={updateGuess} />
                  <button disabled={guess.length < 5} type="submit">Submit</button>
                </form>
              </div>
              <div className="error">
                {error}
              </div>
              <div className="keyboard">
                {keyboard.map((row, i) => {
                  return (
                    <div className="row" key={`row-${i}`}>
                      {row.map((item, j) => {
                        return (
                          <div key={`cell-${i}-${j}`} className={`cell ${item.color}`}>{item.letter}</div>
                        )
                      })}
                    </div>
                  )
                })}
              </div>
            </>
          ) : (
            <button type="button" onClick={playAgain}>Play Again</button>
          )}
        </div>
      </div>
    </div>
  )
};


// button to show _ _ R _ E
// select num of letters
// how to make everyone have same solution each day?
// a cron job?

export default Wordle;
