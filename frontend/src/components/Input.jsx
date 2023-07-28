import React from "react";
import Label from "./Label";

export default function Input({
  id,
  type,
  isRequired,
  labelText,
  defaultValue,
}) {
  return (
    <div className="my-4">
      <Label htmlFor={id} text={labelText} />
      <input
        id={id}
        name={id}
        type={type}
        required={isRequired || true}
        defaultValue={defaultValue || ""}
        className="form-control"
      />
    </div>
  );
}
