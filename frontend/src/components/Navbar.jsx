import React from "react";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "./Button";
import { useResultContext } from "../context/ResultContext";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const { authenticatedUser, setAuthenticatedUser } = useResultContext();

  const navigate = useNavigate();

  function handleLogout() {
    setAuthenticatedUser(null);
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  }
  return (
    <nav className="navbar navbar-expand-md bg-dark fixed-top">
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
            <strong>{authenticatedUser?.username || ""}</strong>
          </span>
          <Button text="Logout" handleOnClick={handleLogout} />
        </div>
      </div>
    </nav>
  );
}
