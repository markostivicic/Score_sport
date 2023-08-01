import React from "react";
import { faBars, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "./Button";
import { useResultContext } from "../context/ResultContext";
import { useLocation, useNavigate } from "react-router-dom";

export default function Navbar() {
  const { authenticatedUser, setAuthenticatedUser, setIsSideNavActive } =
    useResultContext();

  const navigate = useNavigate();

  function handleLogout() {
    setAuthenticatedUser(null);
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  }

  const path = useLocation().pathname;
  const renderHamburger = path !== "/";

  return (
    <nav className="navbar navbar-expand-md bg-dark">
      <div className="container">
        {renderHamburger && (
          <FontAwesomeIcon
            onClick={() => setIsSideNavActive((prev) => !prev)}
            className="hamburger text-secondary"
            icon={faBars}
          />
        )}
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
          {authenticatedUser?.role === "Admin" && path === "/" && (
            <Button
              text="Uređivanje"
              handleOnClick={() => navigate("/sport")}
              margin="mx-2"
            />
          )}
          <Button text="Odjava" handleOnClick={handleLogout} />
        </div>
      </div>
    </nav>
  );
}
