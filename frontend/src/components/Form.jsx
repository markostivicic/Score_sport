import React from "react";
import Button from "./Button";

export default function Form({ formElements, className, handleOnSubmit }) {
  return (
    <form onSubmit={handleOnSubmit} className={className}>
      {formElements.map((FormElement) => {
        return FormElement;
      })}
      <Button text="Potvrdi" />
    </form>
  );
}
