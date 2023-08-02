import React from "react";
import { useResultContext } from "../../context/ResultContext";
import PageLengthSelect from "../PageLengthSelect";

export default function LeagueNavbar({ pageLength, onChangePageLength }) {
  const { currentLeagueTab, setCurrentLeagueTab } = useResultContext();

  return (
    <nav className="navbar navbar-expand-md">
      <div className="container">
        <ul className="navbar-nav">
          <li className="nav-item">
            <span
              onClick={() => setCurrentLeagueTab("clubs")}
              className={`nav-link cursor-pointer ${currentLeagueTab === "clubs" && "active"}`}>
              Klubovi
            </span>
          </li>

          <li className="nav-item">
            <span
              onClick={() => setCurrentLeagueTab("results")}
              className={`nav-link cursor-pointer ${currentLeagueTab === "results" && "active"}`}>
              Rezultati
            </span>
          </li>

          <li className="nav-item">
            <span
              onClick={() => setCurrentLeagueTab("schedule")}
              className={`nav-link cursor-pointer ${currentLeagueTab === "schedule" && "active"}`}>
              Raspored
            </span>
          </li>
        </ul>
        <PageLengthSelect id="pageLength" value={pageLength} onChange={onChangePageLength} />
      </div>
    </nav>
  );
}
