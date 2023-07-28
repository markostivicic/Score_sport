import React from "react";

export default function Button({ color, handleOnClick, text }) {
  return (
    <button className={`btn btn-${color || "primary"}`} onClick={handleOnClick}>
      {text}
    </button>
  );
}
