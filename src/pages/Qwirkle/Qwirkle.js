import React, { useState } from 'react';
import cx from 'classnames';
import { ReactComponent as Star } from './svg_tiles/star.svg';
import './Qwirkle.scss';

const Qwirkle = () => {
  // set up with sockets like escape game so can be 2 player
  // or make ability to play computer? both?

  return (
    <div className="wrapper">
      Game
      <div className="tile">
        <Star />
      </div>
    </div>
  )
};

export default Qwirkle;
