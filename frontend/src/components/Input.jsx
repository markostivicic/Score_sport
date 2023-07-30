import React from "react";
import Label from "./Label";

export default function Input({
  id,
  type,
  isRequired,
  labelText,
  defaultValue,
  wrapperClassName
}) {
  return (
    <div className={wrapperClassName || "my-4"}>
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
