import styled from 'styled-components';

export const Screen = styled.div`
  position: absolute;
  top: 60px;
  left: 0;
  right: 300px;
  bottom: 120px;

  img {
    max-width: 100%;
    max-height: 100%;
  }

  > div {
    position: relative;
    margin: 0 auto;
    height: 100%;
    display: inline-block;
  }

  canvas {
    position: absolute;
    height: 100%;
    width: 100%;
    left: 0;
    top: 0;
  }

  video {
    position: absolute;
    width: 100%;
    left: 0;
    top: 20px;
  }
`;

const overlay = `
  position: absolute;
  background: rgba(255,255,255,0.25);
  cursor: pointer;
`;

const arrow = `
  content: '';
  width: 0;
  height: 0;
  position: absolute;
  border: 14px solid transparent;
`;

export const RightArrow = styled.div`
  ${overlay}
  right: 0;
  top: 0;
  bottom: 0;
  width: 35px;

  > span: after {
    ${arrow}
    top: 50%;
    left: 10px;
    border-left: 14px solid white;
    transform: translateY(-50%);
  }
`;

export const LeftArrow = styled.div`
  ${overlay}
  left: 0;
  top: 0;
  bottom: 0;
  width: 35px;

  > span: after {
    ${arrow}
    top: 50%;
    right: 10px;
    border-right: 14px solid white;
    transform: translateY(-50%);
  }
`;

export const BackArrow = styled.div`
  ${overlay}
  height: 35px;
  bottom: 0;
  right: 0;
  left: 0;

  > span:after {
    ${arrow}
    top: 10px;
    border-top: 14px solid white;
  }
`;

export const StepText = styled.div`
  text-align: center;
  font-size: 16px;
  position: absolute;
  bottom: -20px;
  width: 100%;
`;

export const CloseVideo = styled.div`
  font-size: 28px;
  color: white;
  text-align: center;
  position: absolute;
  bottom: 40px;
  width: 100%;
  background: rgba(255,255,255,0.25);
  text-transform: uppercase;
  cursor: pointer;
`;