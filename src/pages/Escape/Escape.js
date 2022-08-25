import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { randomHexColor } from 'random-hex-color-generator';
import { Link } from 'react-router-dom';

const COOKIE = 'scoreUser';

const Escape = () => {
  const [user, setUser] = useState(null);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const userData = Cookies.get(COOKIE);
    if (userData) {
      try {
        setUser(JSON.parse(decodeURIComponent(userData)));
      } catch (e) {
        // no user
        return;
      }
    }
  }, []);

  const createUser = e => {
    e.preventDefault();
    if (!inputValue) {
      alert('Come on, enter something. Anything.');
      return;
    }
    const userData = {
      name: inputValue,
      color: randomHexColor()
    };
    Cookies.set(COOKIE, JSON.stringify(userData));
    setUser(userData);
  }

  return (
    <div>
      {user && (
        <div>
          <div>Welcome, {user.name}</div>
          <Link to="/escape/game">Enter Game</Link>
        </div>
      )}
      {!user && (
        <div>
          <p>Who are you?</p>
          <form onSubmit={createUser}>
            <input type="text" value={inputValue} onChange={e => setInputValue(e.target.value)} />
            <button onClick={createUser}>Save</button>
          </form>
        </div>
      )}
    </div>
  )
};

export default Escape;
