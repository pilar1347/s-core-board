import React, { useState, useEffect } from 'react';
import { InvWrapper, InvShelf, InvItem } from './Inventory.styles';

const Inventory = ({ user, socket }) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const addInventoryListener = item => {
      setItems((prevItems) => {
        return [...prevItems, item];
      })
    }

    socket.on('add inventory', addInventoryListener);

    return () => {
      socket.off('add inventory', addInventoryListener);
    }
  }, [socket]);

  return (
    <InvWrapper>
      <p>Inventory</p>
      <InvShelf>
        {items.map(item => (
          <InvItem key={item.id}>
            <img alt="item" src="http://placekitten.com/60/60" />
            <div>{item.name}</div>
          </InvItem>
        ))}
      </InvShelf>
    </InvWrapper>
  )
};

export default Inventory;
