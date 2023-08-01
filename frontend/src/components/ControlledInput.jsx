import React from "react";
import Label from "./Label";

export default function ControlledInput({
  id,
  type,
  pattern,
  isRequired,
  isDisabled,
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
        pattern={pattern || null}
        onChange={onChange}
        disabled={isDisabled || false}
        required={isRequired || true}
        className="form-control"
      />
    </div>
  );
}