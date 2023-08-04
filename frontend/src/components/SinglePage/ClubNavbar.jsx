import React from "react";
import { useResultContext } from "../../context/ResultContext";
import PageLengthSelect from "../PageLengthSelect";

export default function ClubNavbar({ pageLength, onChangePageLength }) {
  const { currentClubTab, setCurrentClubTab, lang } = useResultContext();
  const langParsed = JSON.parse(lang);

  return (
    <nav className="navbar navbar-expand-md">
      <div className="container">
        <ul className="navbar-nav">
          <li className="nav-item">
            <span
              onClick={() => setCurrentClubTab("players")}
              className={`nav-link cursor-pointer ${currentClubTab === "players" && "active background-shade"
                }`}
            >
              {langParsed.strPlayers}
            </span>
          </li>

          <li className="nav-item">
            <span
              onClick={() => setCurrentClubTab("results")}
              className={`nav-link cursor-pointer ${currentClubTab === "results" && "active background-shade"
                }`}
            >
              {langParsed.strScores}
            </span>
          </li>

          <li className="nav-item">
            <span
              onClick={() => setCurrentClubTab("schedule")}
              className={`nav-link cursor-pointer ${currentClubTab === "schedule" && "active background-shade"
                }`}
            >
              {langParsed.strSchedule}
            </span>
          </li>
        </ul>
        <PageLengthSelect
          id="pageLength"
          value={pageLength}
          onChange={onChangePageLength}
        />
      </div>
    </nav>
  );
}
