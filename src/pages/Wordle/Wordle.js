import { useEffect, useState } from 'react';
import defaultKeyboard from './keyboard';
import './Wordle.scss';

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
  const [guess, _setGuess] = useState('');
  const [error, setError] = useState('');
  const [word, setWord] = useState([]);
  const [wordList, setWordList] = useState([]);
  const [boardData, setBoardData] = useState([]);
  const [keyboard, setKeyboard] = useState(defaultKeyboard);
  const [isWinner, setIsWinner] = useState(false);

  const setGuess = word => {
    if (error) {
      setError('');
    }
    _setGuess(word);
  }

  useEffect(() => {
    const fetchWords = async () => {
      fetch('./words/5car.txt')
        .then(r => r.text())
        .then(text => {
          const words = text.split('\n').filter(w => {
            if (w.endsWith('S')) return false;
            return true;
          });
          setWordList(words);
          const word = words[Math.floor(Math.random() * words.length)];
          setWord(word);
        })
    }
    fetchWords();
  }, []);

  const makeGuess = e => {
    e.preventDefault();
    const isWord = wordList.includes(guess.toUpperCase());
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

      if (word.toUpperCase() === guess.toUpperCase()) {
        setIsWinner(true);
      }

      setGuess('');
    }
  }

  const playAgain = () => {
    window.location.reload();
  }

  const typeLetter = letter => {
    if (guess.length >= 5) return;
    setGuess(`${guess}${letter}`);
  }

  return (
    <div className="wordle">
      <h1>Wordle</h1>
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
                  <input maxLength="5" type="text" value={guess} onChange={e => setGuess(e.target.value)} />
                </form>
              </div>
              <div className="error">
                {error}
              </div>
              <div className="keyboard">
                {keyboard.map((row, i) => {
                  return (
                    <div className="row" key={`row-${i}`}>
                      {i === 2 && <div key="clear" className="cell gray long-btn" onClick={() => setGuess('')}>CLR</div>}
                      {row.map((item, j) => {
                        return (
                          <div key={`cell-${i}-${j}`} className={`cell ${item.color}`} onClick={() => typeLetter(item.letter)}>{item.letter}</div>
                        )
                      })}
                      {i === 2 && <div key="enter" className="cell gray long-btn" onClick={makeGuess}>GO</div>}
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

export default Wordle;
