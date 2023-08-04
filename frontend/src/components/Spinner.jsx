import React from "react";
import { CircleLoader } from "react-spinners";

export default function Spinner() {
  return (
    <div className="d-flex justify-content-center flex-column align-items-center vw-100 vh-100">
      <CircleLoader color={"#7a4b9c"} size={50} />
    </div>
  );
}
