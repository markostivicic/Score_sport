import React from "react";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "./Button";

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-md bg-dark">
      <div className="container">
        <a href="#" className="navbar-brand">
          <img
            className="logo"
            src={require("../assets/logo.png")}
            alt="logo"
          />
        </a>
        <div className="ms-auto text-secondary mt-2 lg:mt-0">
          <FontAwesomeIcon className="mx-1" icon={faUser} />
          <span className="mx-2">
            <strong>Username</strong>
          </span>
          <Button text="Logout" />
        </div>
      </div>
    </nav>
  );
}
