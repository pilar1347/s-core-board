import { useEffect, useState } from 'react';
import './Scrambler.css';

const MAX_PER_LENGTH = 3;

const getRandomElFromArray = arr => arr[Math.floor(Math.random() * arr.length)];

const removeLetterFromWordAtInd = (arr, ind) => arr.slice(0, ind) + arr.slice(ind + 1, arr.length);

const createRandomArray = (arr, len) => {
  let tempArr = arr.slice();
  const result = [];
  for(let i=0; i<len; i++) {
    const el = getRandomElFromArray(tempArr);
    result.push(el);
    const ind = tempArr.indexOf(el);
    tempArr.splice(ind, 1);
  }
  return result;
}

const checkIfAnagram = (masterWord, word) => {
  let remaining = masterWord;
  for(let i=0; i<word.length; i++) {
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
    if (fitting.length > MAX_PER_LENGTH) {
      fitting = createRandomArray(fitting, MAX_PER_LENGTH);
    }
    return fitting;
  });
}

const sortedWords = arrays => {
  return arrays.map(arr => arr.sort());
}

const getGameInfo = async () => {
  const lens = [4,5,6];
  const promises = lens.map(x => {
    return fetch(`./words/${x}.txt`)
      .then(r => r.text())
      .then(r => r.split('\n'));
  });
  return Promise.all(promises).then(result => {
    const [four, five, six] = result;
    const masterWord = getRandomElFromArray(six);

    const matchingWords = getMatchingWords(masterWord, result);
    matchingWords[2].push(masterWord);

    const words = sortedWords(matchingWords);

    const board = words.reduce((acc, group) => {
      if (group.length) {
        const length = group[0].length;
        acc.push({
          length,
          solved: false,
          words: group.map(word => {
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
        })
      }
      return acc;
    }, []);

    return {
      letters: createRandomArray(masterWord.split(''), masterWord.length),
      board
    };
  });
};

// TODO: Points system
// TODO: Shuffle button
// TODO: Clear tray button
// TODO: Click and drag to reorder in tray

const Scrambler = () => {
  const [letters, setLetters] = useState([]);
  const [trayLetters, setTrayLetters] = useState([]);
  const [board, setBoard] = useState([]);
  const [error, setError] = useState('');
  const [isWinner, setIsWinner] = useState(false);

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

  const tryWord = () => {
    clearError();
    const word = trayLetters.join('');
    let isCorrect = false;

    const newBoard = board.map(wordGroup => {
      if (wordGroup.length === word.length) {
        const words = wordGroup.words.map(wordData => {
          if (word.toUpperCase() === wordData.word.toUpperCase()) {
            isCorrect = true;
            return {
              ...wordData,
              solved: true,
              letters: wordData.letters.map(x => ({ ...x, solved: true }))
            }
          }
          return wordData;
        });
        return { ...wordGroup, words };
      }
      return wordGroup;
    });
    setBoard(newBoard);
    console.log(board);

    if (isCorrect) {
      clearTray();
      
      let winnerCheck = true;
      for (let i=0; i<newBoard.length; i++) {
        const wordGroup = newBoard[i];
        for (let j=0; j<wordGroup.words.length; j++) {
          const word = wordGroup.words[j];
          if (!word.solved) {
            winnerCheck = false;
            break;
          }
        }
      }
      if (winnerCheck) {
        setIsWinner(true);
      }
    } else {
      // TODO: Is in word list? Is too short? etc
      setError('Nope');
    }

  }

  return (
    <div className="wrapper">
      <p>Scrambler</p>
      <div className="board-wrap">
        <div className="board board-col">
          <div className="column">
            {board && board.length && board.map(item => {
              const { words, length } = item;
              return words && words.length && words.map(({ letters }, i) => {
                return (
                  <div className="row" key={`row-${length}-${i}`}>
                    {letters.map(({ letter, solved }, j) => (
                      <div className="blank" key={`blank-${j}`}>
                        {solved && <>{letter}</>}
                      </div>
                    ))}
                  </div>
                )
              });
            })}
          </div>
        </div>
        <div className="board board-letter">
          <div className="row">
            <div className="tray">
              {trayLetters.map((ltr, i) => (
                <div className="letter" key={`letterblock-${i}`} onClick={() => removeFromTray(i)}>
                  {ltr}
                </div>
              ))}
            </div>
            <button type="button" className="submit-btn" onClick={tryWord}>Go</button>
            <button type="button" className="submit-btn" onClick={clearTray}>C</button>
          </div>
          <div className="row">
            <div className="tray bottom-tray">
              {letters.map((ltr, i) => (
                <div className="letter" key={`letterblock-${i}`} onClick={() => moveToTray(i)}>
                  {ltr}
                </div>
              ))}              
            </div>
            <button type="button" className="submit-btn" onClick={shuffleLetters}>%</button>
          </div>
        </div>
        <div className="board">
          {!isWinner ? (
            <div className="error">
              {error}
            </div>
          ) : (
            <>
              <h4>WINNER!!!</h4>
              <button type="button" onClick={playAgain}>Play Again</button>
            </>
          )}
        </div>
      </div>
    </div>
  )
};

export default Scrambler;
