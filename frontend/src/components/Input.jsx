import React from "react";
import Label from "./Label";

export default function Input({ id, type, isRequired, labelText }) {
  return (
    <div className="my-4">
      <Label htmlFor={id} text={labelText} />
      <input
        id={id}
        name={id}
        type={type}
        required={isRequired ? isRequired : true}
        className="form-control"
      />
    </div>
  );
}
