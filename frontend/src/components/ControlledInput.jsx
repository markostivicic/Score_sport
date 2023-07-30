import React from "react";
import Label from "./Label";

export default function ControlledInput({
  id,
  type,
  isRequired,
  labelText,
  value,
  onChange,
}) {
  return (
    <div className="my-4">
      <Label htmlFor={id} text={labelText} />
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        required={isRequired || true}
        className="form-control"
      />
    </div>
  );
}
