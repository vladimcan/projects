import React from "react";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";

function Item(props) {
  function handleLi() {
    props.onClicked(props.id);
  }

  return (
    <li>
      <div className="item">
        {props.content}
        <IconButton onClick={handleLi} aria-label="delete">
          <DeleteIcon />
        </IconButton>
      </div>
    </li>
  );
}

export default Item;
