import React from "react";

export default function Match({ match }) {
  function extractHoursAndMinutes(fullDate) {
    const date = new Date(fullDate);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return hours.toString() + ":" + minutes.toString().padStart(2, "0");
  }
  return (
    <tr className="cursor-pointer">
      <td>{extractHoursAndMinutes(match.time)}</td>
      <td>{match.clubHome.name}</td>
      <td>{match.clubAway.name}</td>
      <td>
        {match.homeScore !== null && `${match.homeScore} : ${match.awayScore}`}
      </td>
    </tr>
  );
}
