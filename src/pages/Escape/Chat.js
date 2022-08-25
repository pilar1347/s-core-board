import React, { useState, useEffect } from 'react';
import { ChatWrapper, ChatForm, ChatMessages } from './Chat.styles';

const Chat = ({ user = {}, socket }) => {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const chatListener = message => {
      setMessages((prevMessages) => {
        return [...prevMessages, message];
      })
    }

    socket.on('chat', chatListener);

    return () => {
      socket.off('chat', chatListener);
    }
  }, [socket]);

  const sendChat = e => {
    e.preventDefault();
    socket.emit('chat', {
      user: user.name,
      message: inputValue,
      color: user.color
    });
    setInputValue('');
  };

  useEffect(() => {
    try {
      const scrollDiv = document.getElementById('chat-messages');
      scrollDiv.scrollTop = scrollDiv.scrollHeight;
    } catch (e) {
      // scroll error
    }
  }, [messages]);

  return (
    <ChatWrapper>
      <ChatMessages id="chat-messages">
        {messages.map(chatItem => (
          <div key={chatItem.id}>
            {chatItem.user === 'bot' ? (
              <p className="botMessage"><strong><em>* {chatItem.message} *</em></strong></p>
            ) : (
              <p><strong style={{ color: chatItem.color || 'black' }}>{chatItem.user}:</strong> {chatItem.message}</p>
            )}
          </div>
        ))}
      </ChatMessages>
      <ChatForm onSubmit={sendChat}>
        <input type="text" value={inputValue} onChange={e => setInputValue(e.target.value)} />
        <button onClick={sendChat}>Send</button>
      </ChatForm>
    </ChatWrapper>
  )
};

export default Chat;
