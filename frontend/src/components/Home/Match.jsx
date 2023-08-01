import React from "react";
import { extractHoursAndMinutes } from "../../services/DateTimeService";
import { useNavigate } from "react-router-dom";

export default function Match({ match }) {
  const navigate = useNavigate();
  return (
    <tr
      className="cursor-pointer"
      onClick={() => navigate(`/single-match/${match.id}`)}
    >
      <td>{extractHoursAndMinutes(match.time)}</td>
      <td>
        <div className="d-flex justify-content-center gap-2">
          <img className="clublogo" src={match.clubHome.logo} alt="logo" />
          <span>{match.clubHome.name}</span>
        </div>
      </td>
      <td>
        {match.homeScore !== null && `${match.homeScore} : ${match.awayScore}`}
      </td>
      <td>
        <div className="d-flex justify-content-center gap-2">
          <span>{match.clubAway.name}</span>
          <img className="clublogo" src={match.clubAway.logo} alt="logo" />
        </div>
      </td>
    </tr>
  );
}
