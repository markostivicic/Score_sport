import React from "react";
import Label from "../Label";

export default function SwitchFilter({ id, text, value, onChange }) {
  return (
    <div className="my-4 d-flex flex-column align-items-center justify-content-between">
      <Label htmlFor={id} text={text} />
      <div className="form-check form-switch">
        <input className="form-check-input" type="checkbox" role="switch" id={id} checked={value} onChange={onChange} />
      </div>
    </div>
  );
}
