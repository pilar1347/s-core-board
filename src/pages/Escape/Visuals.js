import React, { useState, useRef, useEffect } from 'react';
import { Screen, RightArrow, BackArrow, StepText, LeftArrow, CloseVideo } from './Visuals.styles';
import flow from './flow';
import Canvas from './Canvas';

const fastly = 'https://assets.fastly.carvanatech.com';

const Visuals = ({ addInventory, selectedItem, removeInventory, updateGameState, gameState }) => {
  const [step, setStep] = useState(flow.start);
  const [message, setMessage] = useState(null);
  const [size, setSize] = useState({});
  const [video, setVideo] = useState('');
  const [tempText, setTempText] = useState('');
  const imageRef = useRef(null);
  const dragging = useRef(false);
  const imageRect = useRef({});
  const rectRef = useRef({});

  const getCurrentPos = e => {
    const { clientX, clientY } = e;
    return {
      x: clientX - imageRect.current.x,
      y: clientY - imageRect.current.y
    }
  };

  const asPercent = (axis, value) => {
    const parentSize = imageRect.current[axis === 'x' ? 'width' : 'height'];
    return Math.round((value / parentSize) * 100);
  };

  const startRect = e => {
    dragging.current = true;
    const { x, y } = getCurrentPos(e);

    rectRef.current = { x, y };
  }

  const endRect = e => {
    dragging.current = false;

    const { x, y } = getCurrentPos(e);
    const width = x - rectRef.current.x;
    const height = y - rectRef.current.y;

    const final = {
      x: asPercent('x', rectRef.current.x),
      y: asPercent('y', rectRef.current.y),
      width: asPercent('x', width),
      height: asPercent('y', height)
    };

    console.log('final', final);
  }

  const sizeImage = () => {
    if (imageRef.current) {
      setTimeout(() => {
        // TODO: Run this again if window size changes
        imageRect.current = imageRef.current.getBoundingClientRect();
        // setMessage('image size' + imageRect.current.width)
        setSize(imageRect.current);
      }, 1000);
    }
  }

  useEffect(() => {
    sizeImage();
  }, [imageRef]);

  const windowResize = () => {
    sizeImage();
  }

  useEffect(() => {
    window.addEventListener('mousedown', startRect);
    window.addEventListener('mouseup', endRect);
    window.addEventListener('resize', windowResize);

    return () => {
      window.removeEventListener('mousedown', startRect);
      window.removeEventListener('mouseup', endRect);
      window.removeEventListener('resize', windowResize);
    }
  }, []);

  useEffect(() => {
    setTempText('');
  }, [step]);

  const goToLocation = loc => {
    if (!flow[loc]) {
      console.log('no step', loc);
      return;
    }
    if (gameState.won.triggered) {
      setStep(flow.outside);
      return;
    }

    if (loc === 'patioDoor') {
      if (gameState.patioRag.triggered) {
        setStep(flow.patioDoorKey);
        return;
      }
      if (gameState.patioVodka.triggered) {
        setStep(flow.patioDoorRag);
        return;
      }
    }

    if (loc === 'inside') {
      // weird, based on game state
      const stepName = gameState.power.triggered ? 'insideLight' : 'insideDark'
      setStep(flow[stepName]);
      return;
    }
    setStep(flow[loc]);
  }

  const loadVideo = videoUrl => {
    setVideo(videoUrl);
  }

  const closeVideo = () => {
    setVideo('');
  }

  return (
    <Screen className="screen">
      <div>
        <img ref={imageRef} src={`${fastly}/core-hackathon-demo/${step.still}`} alt={step.still} />
        <Canvas
          hotSpots={step.hotSpots}
          size={size}
          goToLocation={goToLocation}
          loadVideo={loadVideo}
          video={video}
          addInventory={addInventory}
          removeInventory={removeInventory}
          selectedItem={selectedItem}
          setText={setTempText}
          updateGameState={updateGameState}
          gameState={gameState}
          setMessage={setMessage}
        />
        {step.right && (
          <RightArrow onClick={() => goToLocation(step.right)}><span /></RightArrow>
        )}
        {step.left && (
          <LeftArrow onClick={() => goToLocation(step.left)}><span /></LeftArrow>
        )}
        {step.back && (
          <BackArrow onClick={() => goToLocation(step.back)}><span /></BackArrow>
        )}
        {(step.text || tempText) && (
          <StepText>{tempText || step.text}</StepText>
        )}
        {message && (
          <StepText style={{ bottom: '-25px' }}>{message}</StepText>
        )}
        {video && (
          <>
            <video controls autoPlay playsInline>
              <source src={`${fastly}/core-hackathon-demo/${video}`} type="video/mp4" />
            </video>
            <CloseVideo onClick={closeVideo}>Close</CloseVideo>
          </>
        )}
      </div>
    </Screen>
  )
};

export default Visuals;
