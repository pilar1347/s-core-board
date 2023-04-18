import React, { useEffect, useState, useRef } from 'react';
import cx from 'classnames';
import { ReactComponent as Bolt } from './svg_tiles/bolt.svg';
import { ReactComponent as Eye } from './svg_tiles/eye.svg';
import { ReactComponent as Face } from './svg_tiles/face.svg';
import { ReactComponent as Heart } from './svg_tiles/heart.svg';
import { ReactComponent as Moon } from './svg_tiles/moon.svg';
import { ReactComponent as Star } from './svg_tiles/star.svg';
import './Qwirkle.scss';

const Tile = ({ Icon, color, selected = false, type, ...restProps }) => {
  return (
    <div className={cx('tile', selected && 'selected', type === 'board' && 'board-tile')} {...restProps}>
      <Icon className={color} />
    </div>
  );
}

const defaultTiles = [
  { Icon: Bolt, color: 'pink' },
  { Icon: Eye, color: 'orange' },
  { Icon: Face, color: 'yellow' },
  { Icon: Heart, color: 'blue' },
  { Icon: Moon, color: 'green' },
  { Icon: Star, color: 'purple' },
];

const SIZE = 50;
const CELL_PX_SIZE = 50;
const GRID_HEIGHT = 550;
const GRID_WIDTH = 900;

// width: 900px;
// height: 550px;

const Qwirkle = () => {
  const [selectedTileIndex, setSelectedTileIndex] = useState(-1);
  const [grid, setGrid] = useState([]);
  const [gridLoc, setGridLoc] = useState({ x: 0, y: 0 });
  const [tiles, setTiles] = useState(defaultTiles);
  const selectTile = i => {
    setSelectedTileIndex(i);
  };

  const initGame = () => {
    
    // how to make grid?
    // has to be able to grow...
    // maybe for now make it a fixed size.
    let g = [];
    for (let i=0; i<SIZE; i++) {
      let row = [];
      for (let j=0; j<SIZE; j++) {
        row.push({ x: i, y: j, tile: null });
      }
      g.push(row);
    };
    setGrid(g);

    // set center point
    const center = -(Math.floor(SIZE/2) * CELL_PX_SIZE);
    setGridLoc({ x: center, y: center });
  };

  useEffect(() => {
    initGame();
  }, []);

  const dragging = useRef(false);
  const start = useRef({ x: 0, y: 0 });
  const dragTimeout = useRef();

  const startDrag = e => {
    start.current = { x: e.clientX, y: e.clientY };
    dragging.current = true;
  };

  const getNewPos = end => {
    return { x: gridLoc.x + (end.x - start.current.x), y: gridLoc.y + (end.y - start.current.y)};
  };

  const dragGrid = e => {
    if (!dragging.current) return;
    clearTimeout(dragTimeout.current);

    const end = { x: e.clientX, y: e.clientY };

    dragTimeout.current = setTimeout(() => {
      setGridLoc(getNewPos(end));
      start.current = { ...end };      
    });
  };

  const roundTo = num => Math.round(num/CELL_PX_SIZE) * CELL_PX_SIZE;

  const endDrag = e => {
    // TODO: attach to window so always stops
    const end = { x: e.clientX, y: e.clientY };
    dragging.current = false;

    // snap to grid
    const endPos = getNewPos(end);
    let snapPos = { x: roundTo(endPos.x), y: roundTo(endPos.y) };
    if (snapPos.x > 0) snapPos.x = 0;
    if (snapPos.y > 0) snapPos.y = 0;
    const max = -(CELL_PX_SIZE * SIZE);
    if (snapPos.x < max + GRID_WIDTH) snapPos.x = max + GRID_WIDTH;
    if (snapPos.y < max + GRID_HEIGHT) snapPos.y = max + GRID_HEIGHT;

    setGridLoc(snapPos);
  };

  const placeTile = (i, j) => {
    if (selectedTileIndex === -1) return;

    const newGrid = [...grid];
    newGrid[i][j].tile = tiles[selectedTileIndex];
    setGrid(newGrid);
    setSelectedTileIndex(-1);
    setTiles(tiles.filter((_, index) => index !== selectedTileIndex));
  };

  return (
    <>
      <h1>Qwirkle</h1>
      <p>I'm a work in progress...</p>
      <div className="wrapper">
        <div className="grid-wrapper">
          <div
            className="grid-zoom"
            style={{ left: gridLoc.x, top: gridLoc.y }}
            onMouseDown={startDrag}
            onMouseMove={dragGrid}
            onMouseUp={endDrag}
          >
            {grid.map((row, i) => (
              <div className="row" key={`row-${i}`}>
                {row.map((col, j) => (
                  <div className="cell" key={`row-${i}-cell-${j}`} onClick={() => placeTile(i, j)}>
                    {col.tile && <Tile Icon={col.tile.Icon} color={col.tile.color} type="board" />}
                  </div>
                ))}
              </div>
            ))}          
          </div>
        </div>
        <div className="tray">
          {tiles.map((tile, i) => (
            <Tile
              key={i}
              Icon={tile.Icon}
              color={tile.color}
              selected={selectedTileIndex === i}
              onClick={() => selectTile(i)}
            />
          ))}       
        </div>
      </div>    
    </>

  )
};

export default Qwirkle;
