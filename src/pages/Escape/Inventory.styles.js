import styled from 'styled-components';

export const InvWrapper = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 120px;
  width: calc(100% - 300px);
  border-top: ${p => p.theme.border};
  text-align: left;

  p {
    margin: 5px 20px;
    text-transform: uppercase;
    color: gray;
    font-size: 14px;
  }
`;

export const InvShelf = styled.div`
  width: 100%;
  padding: 0 20px 0 20px;
  white-space: nowrap;
  overflow-x: auto;
`;

export const InvItem = styled.div`
  width: 80px;
  height: 80px;
  display: inline-block;
  text-align: center;
  cursor: pointer;
  border: 2px solid transparent;

  &.selected {
    border: 2px solid orange;
  }

  div {
    font-size: 13px;
  }

  img {
    width: 60px;
  }
`;