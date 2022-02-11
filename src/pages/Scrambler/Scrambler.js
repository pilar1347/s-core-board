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

    return {
      letters: createRandomArray(masterWord.split(''), masterWord.length),
      words: sortedWords(matchingWords)
    };
  });
}

// TODO: Come up with better data structure and rewrite

const board = [
  {
    length: 4,
    solved: false,
    words: [
      {
        solved: false,
        letters: [
          {
            letter: 'C',
            filled: false
          },
          {
            letter: 'O',
            filled: false
          },
          {
            letter: 'I',
            filled: false
          }          
        ]
      }
    ]
  }
]


const Scrambler = () => {
  const [letters, setLetters] = useState([]);
  const [trayLetters, setTrayLetters] = useState([]);
  const [board, setBoard] = useState([]);
  const [guessed, setGuessed] = useState([]);

  useEffect(() => {
    const setupGame = async () => {
      const game = await getGameInfo();
      setLetters(game.letters);
      setBoard(game.words);
      setGuessed(game.words);
    }
    setupGame();
  }, []);


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
    addLetter(letters[ltrInd], trayLetters, setTrayLetters);
    removeLetter(ltrInd, letters.slice(), setLetters);
  }

  const removeFromTray = ltrInd => {
    addLetter(trayLetters[ltrInd], letters, setLetters);
    removeLetter(ltrInd, trayLetters.slice(), setTrayLetters);
  }

  const tryWord = () => {
    const word = trayLetters.join('');
    const arrayInd = {
      4: 0,
      5: 1,
      6: 2
    };
    const listInd = arrayInd[word.length];
    const wordArray = board[listInd];
    const wordIndex = wordArray.indexOf(word);
    if (wordIndex >= 0) {
      const newGuessed = guessed.slice();
      console.log(newGuessed[listInd][wordIndex]);
      newGuessed[listInd][wordIndex] = newGuessed[listInd][wordIndex].replace(/[a-zA-Z]/g, '?');
      setGuessed(newGuessed);
      console.log('matched!', newGuessed);
    }
    console.log('trying', word, wordArray, board);
  }

  return (
    <div className="wrapper">
      <p>Scrambler</p>
      <div className="board-wrap">
        <div className="board board-col">
          <div className="column">
            {board && board.length && board[0].map((word, i) => {
              return (
                <div className="row" key={`row-${i}`}>
                  {word.split('').map((ltr, j) => {
                    const wasGuessed = guessed && guessed.length && guessed[0][i][j] === '?';
                    return (
                      <div className="blank" key={`blank-${j}`}>
                        {wasGuessed && <>{ltr}</>}
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>
          <div className="column">
            {board && board.length && board[1].map((word, i) => {
              return (
                <div className="row" key={`row-${i}`}>
                  {word.split('').map((ltr, j) => (
                    <div className="blank" key={`blank-${j}`}></div>
                  ))}
                </div>
              )
            })}
            {board && board.length && board[2].map((word, i) => {
              return (
                <div className="row" key={`row-${i}`}>
                  {word.split('').map((ltr, j) => (
                    <div className="blank" key={`blank-${j}`}></div>
                  ))}
                </div>
              )
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
          </div>
          <div className="row">
            <div className="tray bottom-tray">
              {letters.map((ltr, i) => (
                <div className="letter" key={`letterblock-${i}`} onClick={() => moveToTray(i)}>
                  {ltr}
                </div>
              ))}              
            </div>
          </div>
        </div>
        {/* <div className="board">
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
            </>
          ) : (
            <button type="button" onClick={playAgain}>Play Again</button>
          )}
        </div> */}
      </div>
    </div>
  )
};

export default Scrambler;
