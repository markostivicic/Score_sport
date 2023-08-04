import React from "react";
import { useResultContext } from "../../context/ResultContext";
import PageLengthSelect from "../PageLengthSelect";

export default function LeagueNavbar({ pageLength, onChangePageLength }) {
  const { currentLeagueTab, setCurrentLeagueTab, lang } = useResultContext();
  const langParsed = JSON.parse(lang);

  return (
    <nav className="navbar navbar-expand-md">
      <div className="container">
        <ul className="navbar-nav">
          <li className="nav-item">
            <span
              onClick={() => setCurrentLeagueTab("clubs")}
              className={`nav-link cursor-pointer ${currentLeagueTab === "clubs" && "active background-shade"
                }`}
            >
              {langParsed.strClubs}
            </span>
          </li>

          <li className="nav-item">
            <span
              onClick={() => setCurrentLeagueTab("results")}
              className={`nav-link cursor-pointer ${currentLeagueTab === "results" && "active background-shade"
                }`}
            >
              {langParsed.strScores}
            </span>
          </li>

          <li className="nav-item">
            <span
              onClick={() => setCurrentLeagueTab("schedule")}
              className={`nav-link cursor-pointer ${currentLeagueTab === "schedule" && "active background-shade"
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
