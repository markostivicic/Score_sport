import React from "react";
import Label from "../Label";

export default function Input({
  id,
  type,
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
        className="form-control"
      />
    </div>
  );
}
