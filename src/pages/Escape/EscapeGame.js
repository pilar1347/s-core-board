import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { io } from 'socket.io-client';
import Chat from './Chat';
import Inventory from './Inventory';
import Visuals from './Visuals';

const COOKIE = 'scoreUser';

const EscapeGame = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [socket, setSocket] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  const [gameState, setGameState] = useState({
    power: {
      triggered: false,
      message: 'Power is on'
    },
    door: {
      triggered: false,
      message: 'Door is open'
    },
    safe: {
      triggered: false,
      message: 'Safe is open'
    },
    drawer: {
      triggered: false,
      message: 'Drawer is open'
    },
    patioVodka: {
      triggered: false,
      message: 'Patio door has been vodka-ed'
    },
    patioRag: {
      triggered: false,
      message: 'Patio door has been wiped clean'
    },
    won: {
      triggered: false,
      message: 'You are free!!'
    }
  })

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

    const gameStateListener = newState => {
      setGameState((prevState) => {
        return {
          ...prevState,
          [newState]: {
            ...gameState[newState],
            triggered: true
          }
        };
      })
    };

    newSocket.on('game state', gameStateListener);

    return (() => {
      newSocket.off('game state', gameStateListener);
      newSocket.close();
    });
  }, [setSocket]);

  const addInventory = ({ name, image }) => {
    socket.emit('add inventory', {
      name, image
    });
    socket.emit('chat', {
      user: 'bot',
      message: `A ${name} was added to inventory by ${user.name}`,
    })
  };

  const removeInventory = name => {
    socket.emit('remove inventory', {
      name
    });
    socket.emit('chat', {
      user: 'bot',
      message: `${name} was used by ${user.name}`
    });
  }

  const updateGameState = state => {
    socket.emit('game state', state);
    socket.emit('chat', {
      user: 'bot',
      message: `${user.name} made a breakthrough! ${gameState[state].message}!`
    });
  }

  return (
    <div>
      {!user && (
        <p>Loading...</p>
      )}
      {user && (
        <div>
          <Visuals addInventory={addInventory} selectedItem={selectedItem} removeInventory={removeInventory} updateGameState={updateGameState} gameState={gameState} />
          <Inventory user={user} socket={socket} selectedItem={selectedItem} setSelectedItem={setSelectedItem} />
          <Chat user={user} socket={socket} />
        </div>
      )}
    </div>
  )
};

export default EscapeGame;
