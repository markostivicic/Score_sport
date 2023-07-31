import React from "react";
import Label from "./Label";
export default function Select({ id, options, labelText, value, onChange }) {
  return (
    <div className="my-4">
      <Label text={labelText} />
      <select
        id={id}
        name={id}
        onChange={onChange}
        value={value}
        className="form-select"
      >
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
