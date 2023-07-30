import React from "react";
import Button from "./Button";

export default function Form({ handleOnSubmit, buttonText, children }) {
  return (
    <form onSubmit={handleOnSubmit} className="d-flex flex-column width-400">
      {children}
      <Button text={buttonText || "Potvrdi"} />
    </form>
  );
}
