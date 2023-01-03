const getCountArrays = arr => {
  return arr.map(row => {
    const condensedArr = [];
    let i = 0;
    let tally = 0;
    while (i < row.counts.length) {
      if (row.counts[i] === 0) {
        if (tally) {
          condensedArr.push(tally);
        }
        tally = 0;
      } else {
        tally += 1;
      }
      i++;
    }
    if (tally) {
      condensedArr.push(tally);
    }
    return {...row, counts: condensedArr };
  })
};

export const getNumberCounts = gameBoard => {
  const verticals = [];
  const horizontals = [];

  for(let i=0;i<gameBoard.length; i++) {
    const v = { solved: false, correct: false, counts: [] };
    const h = { solved: false, correct: false, counts: [] };
    for (let j=0; j<gameBoard.length; j++) {
      const cell = gameBoard[j][i];
      v.counts.push(cell.answer === 1 ? 1 : 0);
    }
    verticals.push(v);

    for (let j=0; j<gameBoard[i].length; j++) {
      const cell = gameBoard[i][j];
      h.counts.push(cell.answer === 1 ? 1 : 0)
    }
    horizontals.push(h);
  }

  return {
    verticals: getCountArrays(verticals),
    horizontals: getCountArrays(horizontals)
  }
};

export const checkSolution = (numbers, gameBoard) => {
  let isSolved = true;
  const updatedNumbers = {
    horizontals: numbers?.horizontals?.map((row, i) => {
      const gameRow = gameBoard[i];
      let r = {
        ...row,
        solved: gameRow.every(x => x.current),
        correct: gameRow.every(x => x.answer === x.current) 
      };
      if (!r.correct) {
        isSolved = false;
      }
      return r;
    }),
    verticals: numbers?.verticals?.map((column, i) => {
      let c = {
        ...column,
        solved: gameBoard.every(x => x[i].current),
        correct: gameBoard.every(x => x[i].answer === x[i].current)
      };
      if (!c.correct) {
        isSolved = false;
      }
      return c;
    })    
  };

  return {
    isSolved,
    updatedNumbers
  }
};
