import React from "react";

export default function FormContainer({ children }) {
  return (
    <div className="d-flex w-100 h-100 bg-light justify-content-center align-items-center">
      {children}
    </div>
  );
}
