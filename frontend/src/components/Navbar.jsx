import React from "react";
import { faBars, faGear, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "./Button";
import { useResultContext } from "../context/ResultContext";
import { useLocation, useMatch, useNavigate } from "react-router-dom";

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
  const isRouteSingleLeague = useMatch({
    path: "/single-league/:id",
  });
  const renderHamburger = path !== "/" && !isRouteSingleLeague;

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
        <a href="/" className="navbar-brand">
          <img
            className="logo"
            src={require("../assets/logo.png")}
            alt="logo"
          />
        </a>
        <div className="ms-auto text-secondary mt-2 lg:mt-0 nav-text">
          <FontAwesomeIcon className="mx-1" icon={faUser} />
          <span className="mx-2">
            <strong>{authenticatedUser?.username || ""}</strong>
          </span>
          {authenticatedUser?.role === "Admin" && path === "/" && (
            <FontAwesomeIcon
              icon={faGear}
              className="mx-2 cursor-pointer nav-text"
              onClick={() => navigate("/sport")}
            />
          )}
          <Button text="Odjava" margin="mx-2" handleOnClick={handleLogout} />
        </div>
      </div>
    </nav>
  );
}
