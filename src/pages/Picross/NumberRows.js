import React from 'react';
import cx from 'classnames';

export const HorizontalNumbers = ({ horizontals = [] }) => {
  return (
    <div className="number-horizontals">
      {horizontals?.map((row, i) => {
        const classes = cx('h-row', {
          wrong: row.solved && !row.correct,
          correct: row.solved && row.correct
        });
        return (
          <div className={classes} key={`nh-row-${i}`}>
            {row.counts.map((cell, j) => (
              <div className="h-cell" key={`nh-cell-${i}-${j}`}>
                {cell}
              </div>
            ))}
          </div>
        )
      })}
    </div> 
  )
};

export const VerticalNumbers = ({ verticals = [] }) => {
  return (
    <div className="number-verticals">
      {verticals?.map((row, i) => {
        const classes = cx('v-row', {
          wrong: row.solved && !row.correct,
          correct: row.solved && row.correct
        });
        return (
          <div className={classes} key={`nv-row-${i}`}>
            {row.counts.map((cell, j) => (
              <div className="v-cell" key={`nv-cell-${i}-${j}`}>
                {cell}
              </div>
            ))}
          </div>
        )
      })}
    </div>
  )
}
