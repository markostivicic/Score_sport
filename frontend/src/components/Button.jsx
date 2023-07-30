import React from "react";

export default function Button({ color, handleOnClick, text, margin }) {
  return (
    <button
      className={`btn btn-${color || "primary"} align-self-center ${
        margin || ""
      }`}
      onClick={handleOnClick}
    >
      {text}
    </button>
  );
}
