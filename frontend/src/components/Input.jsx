import React from "react";
import Label from "./Label";

export default function Input({
  id,
  type,
  isRequired,
  isDisabled,
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
        disabled={isDisabled || false}
        required={isRequired || true}
        defaultValue={defaultValue || null}
        className="form-control"
      />
    </div>
  );
}
