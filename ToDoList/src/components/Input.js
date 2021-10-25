import React from "react";
import { useState } from "react";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import IconButton from "@material-ui/core/IconButton";

function Input(props) {
  const [newItem, setNewItem] = useState("");

  function handleInput(event) {
    const value = event.target.value;
    setNewItem(value);
  }

  function handleButton() {
    props.onChanged(newItem);
    setNewItem("");
  }

  return (
    <div className="form">
      <input
        type="text"
        onChange={handleInput}
        value={newItem}
        placeholder="New Item"
      />
      <IconButton onClick={handleButton} aria-label="delete">
        <AddCircleIcon color="action" fontSize="large" />
      </IconButton>
    </div>
  );
}

export default Input;
