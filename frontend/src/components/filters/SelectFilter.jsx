import React from "react";
import Label from "../Label";

export default function SelectFilter({ id, options, labelText, value, onChange, isDisabled }) {
  return (
    <div className="my-4">
      <Label text={labelText} />
      <select id={id} name={id} onChange={onChange} value={value} disabled={isDisabled || false} className="form-select">
        {options.map((option) => {
          return (
            <option key={option.value} value={option.value}>
              {option.text}
            </option>
          );
        })}
      </select>
    </div>
  );
}
