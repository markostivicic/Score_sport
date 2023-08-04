import React from "react";
import Label from "./Label";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Input({
  id,
  type,
  isRequired,
  isDisabled,
  labelText,
  defaultValue,
  wrapperClassName,
  isInputGroup,
  icon,
}) {
  if (!isInputGroup)
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
  return (
    <div className={wrapperClassName || "my-4"}>
      <Label htmlFor={id} text={labelText} />
      <div className="input-group">
        <input
          id={id}
          name={id}
          type={type}
          disabled={isDisabled || false}
          required={isRequired || true}
          defaultValue={defaultValue || null}
          className="form-control"
        />
        <div className="input-group-text">
          <FontAwesomeIcon icon={icon} />
        </div>
      </div>
    </div>
  );
}
