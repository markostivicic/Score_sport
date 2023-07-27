import React from "react";
import Label from "./Label";

export default function Select({ options, labelText }) {
  return (
    <div className="my-4">
      <Label text={labelText} />
      <select className="form-select">
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
