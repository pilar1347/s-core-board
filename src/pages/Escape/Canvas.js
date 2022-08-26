import React, { useRef, useEffect } from 'react';

const getPxValuesArray = (coords, context) => {
  const toPx = (axis, value) => {
    const a = axis === 'x' ? context.canvas.width : context.canvas.height;
    return (value / 100) * a;
  };
  const { x, y, width, height } = coords;
  const pxValues = [toPx('x', x), toPx('y', y), toPx('x', width), toPx('y', height)];
  return pxValues;
}

const Canvas = ({
  hotSpots = [],
  size = {},
  goToLocation,
  loadVideo,
  video,
  addInventory,
  removeInventory,
  selectedItem,
  setText,
  updateGameState,
  gameState,
  setMessage
}) => {
  const canvasRef = useRef(null);
  const ctx = useRef({});

  const fillBlack = () => {
    ctx.current.fillStyle = '#000000';
    ctx.current.fillRect(0, 0, ctx.current.canvas.width, ctx.current.canvas.height);
  }

  const initCanvas = () => {
    const canvas = canvasRef.current;
    ctx.current = canvas.getContext('2d');
    // ctx.current.fillStyle = '#000000';
    ctx.current.fillStyle = 'transparent';

    ctx.current.clearRect(0, 0, ctx.current.canvas.width, ctx.current.canvas.height);
    if (!hotSpots.length) return;

    hotSpots.forEach(spot => {
      const pxValues = getPxValuesArray(spot.coords, ctx.current);
      ctx.current.fillRect(...pxValues);
    });
  }

  useEffect(() => {
    initCanvas();
  }, [hotSpots, size]);

  useEffect(() => {
    if (!video) {
      initCanvas();
    }
  }, [video]);

  const clickedCanvas = e => {
    const parent = e.target.getBoundingClientRect();
    const { clientX, clientY } = e;

    const clickedX = clientX - parent.left;
    const clickedY = clientY - parent.top;

    // const sp = getPxValuesArray(hotSpots[0].coords, ctx.current)
    // setMessage(JSON.stringify(ctx.current.canvas.width));

    // now check if that is inside of a hotspot
    hotSpots.forEach(spot => {
      const pxValues = getPxValuesArray(spot.coords, ctx.current);

      if (clickedX > pxValues[0] &&
        clickedX < pxValues[0] + pxValues[2] &&
        clickedY > pxValues[1] &&
        clickedY < pxValues[1] + pxValues[3]
      ) {
        console.log('hit!');

        const initLocation = loc => {
          if (loc === 'nowhere') {
            initCanvas();
            return;
          };

          if (typeof loc === 'string') {
            goToLocation(loc);
          } else {
            // is based on game state
            try {
              const key = Object.keys(loc)[0];
              const stateObj = gameState[key];
              const locationBasedOnState = loc[key][stateObj.triggered];
              if (locationBasedOnState === 'nowhere') {
                initCanvas();
                return;
              }
              goToLocation(locationBasedOnState);
            } catch (e) {
              console.error('stuff is broke');
            }
          }
        }

        if (spot.location) {
          fillBlack();
          initLocation(spot.location);
        }

        if (spot.video) {
          fillBlack();
          loadVideo(spot.video);
        }

        if (spot.inventory) {
          addInventory(spot.inventory);
        }

        if (spot.gameState) {
          updateGameState(spot.gameState);
        }

        if (spot.text) {
          setText(spot.text);
        }

        if (spot.use) {
          if (!selectedItem && spot.use?.null) {
            setText(spot?.use?.null?.text);
          };

          if (selectedItem && spot.use[selectedItem?.name]) {
            const result = spot.use[selectedItem.name];

            if (result.text) {
              setText(result.text);
            }

            if (result.video) {
              fillBlack();
              loadVideo(result.video);

              if (result.location) {
                initLocation(result.location);
              }

              if (result.gameState) {
                updateGameState(result.gameState);
              }

              if (result.removeFromInventory) {
                removeInventory(selectedItem.name);
              }
            }
          } else if (selectedItem && spot.use?.null) {
            setText(spot?.use?.null?.text);
          }
        }
      }
    })
  }

  return <canvas ref={canvasRef} onClick={clickedCanvas} width={size.width} height={size.height} />;
};

export default Canvas;
