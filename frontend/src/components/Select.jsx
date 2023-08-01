import React from "react";
import Label from "./Label";

export default function Select({ id, options, labelText, value, onChange, isRequired, isDisabled }) {
  return (
    <div className="my-4">
      <Label text={labelText} />
      <select id={id} name={id} onChange={onChange} value={value} required={isRequired || true} disabled={isDisabled || false} className="form-select">
        {options.map((option) => {
          return (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          );
        })}
      </select>
    </div>
  );
}
