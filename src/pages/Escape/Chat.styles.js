import styled from 'styled-components';

export const ChatWrapper = styled.div`
  position: absolute;
  top: 60px;
  right: 0;
  width: 300px;
  bottom: 0;
  border-left: ${p => p.theme.border};
  padding: 10px;
`;

export const ChatForm = styled.form`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 60px;
  padding: 10px;
  display: flex;

  input {
    margin-right: 10px;
    font-size: 16px;
    width: 200px;
  }

  button {
    text-transform: uppercase;
    flex: 1;
  }
`;

export const ChatMessages = styled.div`
  width: 100%;
  text-align: left;
  height: calc(100% - 60px);
  overflow-y: auto;
  font-size: 14px;
  p {
    margin: 0.5em 0;
  }
  .botMessage {
    color: #2b0557;
    font-size: 12px;
    font-famiy: monospace;
  }
`;