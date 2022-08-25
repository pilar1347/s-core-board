import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { io } from 'socket.io-client';
import Chat from './Chat';
import Inventory from './Inventory';

const COOKIE = 'scoreUser';

const EscapeGame = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (socket) {
      const userData = Cookies.get(COOKIE);

      if (userData) {
        try {
          const u = JSON.parse(decodeURIComponent(userData));
          setUser(u);
          socket.emit('user joined', u.name);
        } catch (e) {
          navigate('/escape');
        }
      } else {
        navigate('/escape');
      }
    }
  }, [socket]);

  useEffect(() => {
    const newSocket = io('https://peaceful-garden-48749.herokuapp.com');
    setSocket(newSocket);

    return (() => {
      newSocket.close();
    });
  }, [setSocket]);

  const addInventory = () => {
    socket.emit('add inventory', {
      name: 'rock'
    });
    socket.emit('chat', {
      user: 'bot',
      message: `A rock was added to inventory by ${user.name}`,
    })
  };

  return (
    <div>
      {!user && (
        <p>Loading...</p>
      )}
      {user && (
        <div>
          <p>Welcome, {user.name}</p>
          <button onClick={addInventory}>Add something</button>
          <Inventory user={user} socket={socket} />
          <Chat user={user} socket={socket} />
        </div>
      )}
    </div>
  )
};

export default EscapeGame;
