import React from "react";
import Label from "../Label";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

export default function Input({
  id,
  type,
  labelText,
  handleOnClick
}) {
  return (
    <div className="my-4">
      <Label htmlFor={id} text={labelText} />
      <div className="d-flex flex-row justify-content-center align-items-center gap-3">
        <input
          id={id}
          name={id}
          type={type}
          className="form-control"
        />
        <FontAwesomeIcon
          className="cursor-pointer"
          onClick={handleOnClick}
          icon={faSearch}
        />
      </div>
    </div>
  );
}
