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
      <td>{match.clubHome.name}</td>
      <td>{match.clubAway.name}</td>
      <td>
        {match.homeScore !== null && `${match.homeScore} : ${match.awayScore}`}
      </td>
    </tr>
  );
}
