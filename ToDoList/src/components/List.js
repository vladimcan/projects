import React, { useState } from "react";
import Item from "./Item";
import Input from "./Input";

function List() {
  const [items, setItems] = useState([]);

  function addItem(newItem) {
    setItems([...items, newItem]);
  }

  function deleteItem(id) {
    setItems(items.filter((item, index) => index !== id));
  }

  return (
    <div className="container">
      <Input onChanged={addItem} />
      <ul>
        {items.map(function (item, index) {
          return (
            <Item
              id={index}
              key={index}
              content={item}
              onClicked={deleteItem}
            />
          );
        })}
      </ul>
    </div>
  );
}

export default List;
