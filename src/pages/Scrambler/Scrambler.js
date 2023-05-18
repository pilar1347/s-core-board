import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import './Scrambler.scss';

const MAX_WORDS_PER_LENGTH = 10;
const MIN_WORD_LENGTH = 3;

// TODO: SCORing!
// Show message if they already guessed something or its already on the board
// Timer?
// Clean this up - separate files and unit tests
// Mobile view
// drag and drop letters
// Hints
// should it clear all tray ltters on any guess?

const getRandomElFromArray = arr => arr[Math.floor(Math.random() * arr.length)];

const removeLetterFromWordAtInd = (arr, ind) => arr.slice(0, ind) + arr.slice(ind + 1, arr.length);

const createRandomArray = (arr, len) => {
  let tempArr = arr.slice();
  const result = [];
  for (let i = 0; i < len; i++) {
    const el = getRandomElFromArray(tempArr);
    result.push(el);
    const ind = tempArr.indexOf(el);
    tempArr.splice(ind, 1);
  }
  return result;
}

const checkIfAnagram = (masterWord, word) => {
  let remaining = masterWord;
  for (let i = 0; i < word.length; i++) {
    const letter = word[i];
    const ind = remaining.indexOf(letter);
    if (ind < 0) return false;
    remaining = removeLetterFromWordAtInd(remaining, ind);
  }
  return true;
}

const getMatchingWords = (masterWord, words) => {
  return words.map(wordArray => {
    let fitting = wordArray.filter(word => {
      if (word === masterWord) return false;
      return checkIfAnagram(masterWord, word);
    });
    if (fitting.length > MAX_WORDS_PER_LENGTH) {
      fitting = createRandomArray(fitting, MAX_WORDS_PER_LENGTH);
    }
    return fitting;
  });
}

const sortedWords = arrays => {
  return arrays.map(arr => arr.sort())
};

const getGameInfo = async () => {
  const lens = [3, 4, 5, 6];
  const promises = lens.map(x => {
    return fetch(`./words/${x}car.txt`)
      .then(r => r.text())
      .then(r => r.split('\n'));
  });
  return Promise.all(promises).then(result => {
    const six = result[result.length - 1];
    const masterWord = getRandomElFromArray(six);

    const matchingWords = getMatchingWords(masterWord, result);
    matchingWords[3].push(masterWord);

    const words = sortedWords(matchingWords);

    const board = words.reduce((acc, group) => {
      const newWords = group?.map(word => {
        return {
          solved: false,
          word,
          letters: word.split('').map(letter => {
            return {
              letter,
              solved: false
            }
          })
        }
      })

      return [...acc, ...newWords];
    }, []);

    return {
      letters: createRandomArray(masterWord.split(''), masterWord.length),
      board
    };
  });
};

const fireConfetti = () => {
  const canvas = document.createElement('canvas');
  canvas.style.position = 'absolute';
  canvas.style.top = '100px';
  canvas.style.left = '10%';
  canvas.style.width = '80%';
  canvas.style.height = '800px';
  document.body.appendChild(canvas);

  const myConfetti = confetti.create(canvas);
  myConfetti({
    particleCount: 125,
    spread: 160
  })
}

const Scrambler = () => {
  const [letters, setLetters] = useState([]);
  const [trayLetters, setTrayLetters] = useState([]);
  const [board, setBoard] = useState([]);
  const [error, setError] = useState('');
  const [isWinner, setIsWinner] = useState(false);
  const [guessedWords, setGuessedWords] = useState([]);

  useEffect(() => {
    const setupGame = async () => {
      const game = await getGameInfo();
      setLetters(game.letters);
      setBoard(game.board);
    }
    setupGame();
  }, []);

  const clearError = () => {
    if (error) {
      setError('');
    }
  }

  const playAgain = () => {
    window.location.reload();
  }

  const removeLetter = (index, array, stateSetter) => {
    array.splice(index, 1);
    stateSetter(array);
  }

  const addLetter = (letter, array, stateSetter) => {
    stateSetter([...array, letter]);
  }

  const moveToTray = ltrInd => {
    clearError();
    addLetter(letters[ltrInd], trayLetters, setTrayLetters);
    removeLetter(ltrInd, letters.slice(), setLetters);
  }

  const removeFromTray = ltrInd => {
    clearError();
    addLetter(trayLetters[ltrInd], letters, setLetters);
    removeLetter(ltrInd, trayLetters.slice(), setTrayLetters);
  }

  const shuffleLetters = () => {
    setLetters(createRandomArray(letters, letters.length));
  }

  const clearTray = () => {
    setLetters([...letters, ...trayLetters]);
    setTrayLetters([]);
  }

  const renderBoard = board => {
    const MAX_PER_COLUMN = 8;
    const columnCount = Math.ceil(board.length / MAX_PER_COLUMN);
    const colArray = Array.from(Array(columnCount).keys());
    const rowArray = Array.from(Array(MAX_PER_COLUMN).keys());

    let runningIndex = 0;
    return colArray.map(colInd => {
      return (
        <div className="answer-column" key={`column-${colInd}`}>
          {rowArray.map(rowInd => {
            const el = (
              <div className="answer-row" key={`row-${rowInd}`}>
                {board?.[runningIndex]?.letters?.map(({ letter, solved }, j) => (
                  <div className="blank" key={`blank-${j}`}>
                    {solved && <>{letter}</>}
                  </div>
                ))}
              </div>
            );
            runningIndex += 1;
            return el;
          })}
        </div>
      )
    });
  };

  const tryWord = () => {
    clearError();
    const guessedWord = trayLetters.join('');
    let isCorrect = false;

    const newBoard = board.map(wordData => {
      if (guessedWord.toUpperCase() === wordData.word.toUpperCase()) {
        isCorrect = true;
        return {
          ...wordData,
          solved: true,
          letters: wordData.letters.map(x => ({ ...x, solved: true }))
        }
      }
      return wordData;
    });

    setBoard(newBoard);

    if (isCorrect) {
      clearTray();

      let winnerCheck = true;
      for (let i = 0; i < newBoard.length; i++) {
        const word = newBoard[i];
        if (!word.solved) {
          winnerCheck = false;
          break;
        }
      }
      if (winnerCheck) {
        setIsWinner(true);
        fireConfetti();
      }
    } else {
      if (guessedWord.length < MIN_WORD_LENGTH) {
        setError('Too short');
        return;
      }
      if (!guessedWords.includes(guessedWord)) {
        setGuessedWords([...guessedWords, guessedWord]);
      }
      setError('Nope');
    }
  }

  const matchTrayToInput = e => {
    const typedLetter = e.key.toUpperCase();
    if (typedLetter === 'ENTER') {
      tryWord();
      return;
    }
    if (typedLetter === 'BACKSPACE' && trayLetters.length > 0) {
      removeFromTray(trayLetters.length - 1);
      return;
    }
    const ltrIndex = letters.indexOf(typedLetter);
    if (ltrIndex >= 0) {
      moveToTray(ltrIndex);
    }
  }

  const revealAll = () => {
    setBoard(board.map(wordData => {
      return {
        ...wordData,
        solved: true,
        letters: wordData.letters.map(letter => ({
          ...letter,
          solved: true
        }))
      }
    }));
  }

  return (
    <div className="wrapper scrambler">
      <h1>Scrambler</h1>
      <div className="text">
        <h2>Rules</h2>
        <ul>
          <li>Make a guess of {MIN_WORD_LENGTH}+ letters using only letters provided</li>
          <li>Answer list is in alphabetical order grouped by word length</li>
        </ul>
      </div>
      <div className="board-wrap">
        <div className="board">
          {renderBoard(board)}
        </div>
        <div className="letter-rows">
          <div className="row">
            <div className="tray">
              <input type="text" className="answerInput" maxLength={5} onKeyDown={matchTrayToInput} />
              {trayLetters.map((ltr, i) => (
                <div className="letter" key={`letterblock-${i}`} onClick={() => removeFromTray(i)}>
                  {ltr}
                </div>
              ))}
            </div>
            <button type="button" className="action-btn" onClick={tryWord}>Go</button>
            <button type="button" className="action-btn" onClick={clearTray}>CLR</button>
          </div>
          <div className="row">
            <div className="tray bottom-tray">
              {letters.map((ltr, i) => (
                <div className="letter" key={`letterblock-${i}`} onClick={() => moveToTray(i)}>
                  {ltr}
                </div>
              ))}
            </div>
            <button type="button" className="action-btn" onClick={shuffleLetters}>SHUFFLE</button>
          </div>
        </div>
        {!isWinner ? (
          <div className="error">
            {error}
          </div>
        ) : (
          <>
            <h2>WINNER!!!</h2>
            <button type="button" onClick={playAgain}>Play Again</button>
          </>
        )}
      </div>
      <div className="text">
        {guessedWords.length ? <h2>Guessed Words</h2> : null}
        {guessedWords.map(word => {
          return (
            <div key={word}>
              {word}
            </div>
          )
        })}
      </div>
      <div className="text">
        <button type="button" onClick={revealAll}>I suck and I give up</button>
      </div>
    </div>
  )
};

export default Scrambler;
