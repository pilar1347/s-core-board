import React, { useState, useEffect } from 'react';
import { InvWrapper, InvShelf, InvItem } from './Inventory.styles';

const fastly = 'https://assets.fastly.carvanatech.com';

const Inventory = ({ user, socket, selectedItem = {}, setSelectedItem }) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const addInventoryListener = item => {
      setItems((prevItems) => {
        const alreadyGotIt = prevItems.find(x => x.name === item.name);
        if (alreadyGotIt) return [...prevItems];
        return [...prevItems, item];
      })
    };

    const removeInventoryListener = item => {
      setItems((prevItems) => {
        return prevItems.filter(x => x.name !== item.name)
      });
      if (selectedItem && selectedItem.name === item.name) {
        setSelectedItem(null);
      }
    }

    socket.on('add inventory', addInventoryListener);
    socket.on('remove inventory', removeInventoryListener);

    return () => {
      socket.off('add inventory', addInventoryListener);
      socket.off('remove inventory', removeInventoryListener);
    }
  }, [socket]);

  return (
    <InvWrapper>
      <p>Inventory</p>
      <InvShelf>
        {items.map(item => (
          <InvItem key={item.id} onClick={() => setSelectedItem(item)} className={item?.id === selectedItem?.id ? 'selected' : ''}>
            <img alt="item" src={`${fastly}/core-hackathon-demo/${item.image}`} />
            <div>{item.name}</div>
          </InvItem>
        ))}
      </InvShelf>
    </InvWrapper>
  )
};

export default Inventory;
