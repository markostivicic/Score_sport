import React from "react";
import { faBars, faGear, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "./Button";
import { useResultContext } from "../context/ResultContext";
import { useLocation, useMatch, useNavigate } from "react-router-dom";
import Select from "./Select";
import { stringEn, stringHr } from "../services/TranslateService";

export default function Navbar() {
  const {
    authenticatedUser,
    setAuthenticatedUser,
    setIsSideNavActive,
    setLang,
    lang,
  } = useResultContext();
  const navigate = useNavigate();
  const langParsed = JSON.parse(lang);

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
        <div className="ms-auto text-secondary mt-2 lg:mt-0 nav-text d-flex align-items-center gap-3">
          <div className="d-flex gap-2 align-items-center">
            <FontAwesomeIcon icon={faUser} />
            <span>
              <strong>{authenticatedUser?.username || ""}</strong>
            </span>
          </div>
          {authenticatedUser?.role === "Admin" && path === "/" && (
            <FontAwesomeIcon
              icon={faGear}
              className="cursor-pointer nav-text"
              onClick={() => navigate("/sport")}
            />
          )}
          <select
            className="form-control"
            defaultValue={lang}
            onChange={(e) => setLang(e.target.value)}
          >
            <option value={JSON.stringify(stringHr)}>HR</option>
            <option value={JSON.stringify(stringEn)}>EN</option>
          </select>
          <Button text={langParsed.strLogout} handleOnClick={handleLogout} />
        </div>
      </div>
    </nav>
  );
}
