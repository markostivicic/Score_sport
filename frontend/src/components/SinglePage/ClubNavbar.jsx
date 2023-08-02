import React from "react";
import { useResultContext } from "../../context/ResultContext";
import PageLengthSelect from "../PageLengthSelect";

export default function ClubNavbar({ pageLength, onChangePageLength }) {
  const { currentClubTab, setCurrentClubTab } = useResultContext();

  return (
    <nav className="navbar navbar-expand-md">
      <div className="container">
        <ul className="navbar-nav">
          <li className="nav-item">
            <span
              onClick={() => setCurrentClubTab("players")}
              className={`nav-link cursor-pointer ${currentClubTab === "players" && "active"}`}>
              Igrači
            </span>
          </li>

          <li className="nav-item">
            <span
              onClick={() => setCurrentClubTab("results")}
              className={`nav-link cursor-pointer ${currentClubTab === "results" && "active"}`}>
              Rezultati
            </span>
          </li>

          <li className="nav-item">
            <span
              onClick={() => setCurrentClubTab("schedule")}
              className={`nav-link cursor-pointer ${currentClubTab === "schedule" && "active"}`}>
              Raspored
            </span>
          </li>
        </ul>
        <PageLengthSelect id="pageLength" value={pageLength} onChange={onChangePageLength} />
      </div>
    </nav>
  );
}
