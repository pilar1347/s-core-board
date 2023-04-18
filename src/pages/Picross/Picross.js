import React, { useEffect, useState, useRef } from 'react';
import cx from 'classnames';
import './Picross.scss';
import { getNumberCounts, checkSolution } from './Picross-logic';
import { VerticalNumbers, HorizontalNumbers } from './NumberRows';

// start with just game setup
// create builder to save puzzles
// add DB to save user-created puzzles?
// Add screen to choose what size you want to do
const game = [
  [
    {
      current: 0,
      answer: 1, // 1 is filled, // 2 is x-ed out, 0 is nothing
    },
    {
      current: 0,
      answer: 2, // 1 is filled, // 2 is x-ed out, 0 is nothing
    },
    {
      current: 0,
      answer: 1, // 1 is filled, // 2 is x-ed out, 0 is nothing
    }
  ],
  [
    {
      current: 0,
      answer: 1, // 1 is filled, // 2 is x-ed out, 0 is nothing
    },
    {
      current: 0,
      answer: 1, // 1 is filled, // 2 is x-ed out, 0 is nothing
    },
    {
      current: 0,
      answer: 2, // 1 is filled, // 2 is x-ed out, 0 is nothing
    }
  ],
  [
    {
      current: 0,
      answer: 2, // 1 is filled, // 2 is x-ed out, 0 is nothing
    },
    {
      current: 0,
      answer: 2, // 1 is filled, // 2 is x-ed out, 0 is nothing
    },
    {
      current: 0,
      answer: 1, // 1 is filled, // 2 is x-ed out, 0 is nothing
    }
  ]
];

const Picross = () => {
  const [gameBoard, setGameBoard] = useState(game);
  const [validated, setValidated] = useState(false);
  const [numbers, setNumbers] = useState({});
  const [winner, setWinner] = useState(false);

  const debounceTimeout = useRef(null);

  useEffect(() => {
    const counts = getNumberCounts(gameBoard);
    setNumbers(counts);
  }, []);

  useEffect(() => {
    if (!numbers.horizontals) return false;
    clearTimeout(debounceTimeout.current);

    debounceTimeout.current = setTimeout(() => {
      const {isSolved, updatedNumbers} = checkSolution(numbers, gameBoard);
      setNumbers(updatedNumbers);
      if (isSolved) {
        setWinner(true);
      }
    }, 500);
  }, [gameBoard]);

  const selectCell = (a, b) => {
    setGameBoard(gameBoard.map((row, i) => {
      return row.map((cell, j) => {
        if (i === a && j === b) {
          return {
            ...cell,
            current: (cell.current + 1) % 3
          }
        } else {
          return cell;
        }
      })
    }))
  }

  const getCellClasses = cell => {
    return cx('grid-cell', {
      'exed': cell.current === 2,
      'colored': cell.current === 1,
      'wrong': validated && cell.current !== cell.answer
    })
  };

  return (
    <>
      <div className="controls">
        <p>This is in progress...</p>
        <button onClick={() => setValidated(!validated)}>
          {validated ? 'Hide Answers' : 'Check'}
        </button>
      </div>
      {winner && (
        <div className="winner-banner">YOU WIN!!</div>
      )}
      <div className="wrapper">
        <div className="game-wrap">
          <VerticalNumbers verticals={numbers?.verticals} />
          <div className="secondary-wrap">
            <HorizontalNumbers horizontals={numbers?.horizontals} />
            <div className="grid">
              {gameBoard.map((row, i) => {
                return (
                  <div className="grid-row" key={`row-${i}`}>
                    {row.map((cell, j) => {
                      return (
                        <div
                          className={getCellClasses(cell)}
                          key={`cell-${i}-${j}`}
                          onClick={e => selectCell(i, j)}
                        />
                      )
                    })}
                  </div>
                )
              })}
            </div>             
          </div>
        </div>
      </div>
    </>
  )
};

export default Picross;
