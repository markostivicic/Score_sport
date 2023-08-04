import React from "react";
import { useResultContext } from "../context/ResultContext";
import Button from "./Button";

export default function Form({ handleOnSubmit, buttonText, children }) {
  const { lang } = useResultContext();

  const langParsed = JSON.parse(lang);
  return (
    <form onSubmit={handleOnSubmit} className="d-flex flex-column width-400 pb-3">
      {children}
      <Button text={buttonText || langParsed.strConfirm} />
    </form>
  );
}
