import React, { useEffect, useState } from "react";
import { extractHoursAndMinutes } from "../../services/DateTimeService";
import { useNavigate } from "react-router-dom";
import {
  changeFavouriteMatchStatusAsync,
  getFavouriteMatchByMatchIdAsync,
} from "../../services/FavouriteMatchService";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Match({ match }) {
  const [isMatchFavourite, setIsMatchFavourite] = useState(null);
  const navigate = useNavigate();

  async function handleToggleFavouriteMatch(e) {
    e.stopPropagation();
    await changeFavouriteMatchStatusAsync(
      navigate,
      !isMatchFavourite,
      match.id
    );
    setIsMatchFavourite(!isMatchFavourite);
  }

  useEffect(() => {
    async function getFavouriteMatchAsync() {
      const favouriteMatch = await getFavouriteMatchByMatchIdAsync(
        navigate,
        match.id,
        true
      );
      setIsMatchFavourite(favouriteMatch !== null);
    }
    getFavouriteMatchAsync();
  }, [isMatchFavourite]);

  return (
    <tr
      className="cursor-pointer"
      onClick={() => navigate(`/single-match/${match.id}`)}
    >
      <td onClick={handleToggleFavouriteMatch}>
        {isMatchFavourite !== null && (
          <FontAwesomeIcon
            className={`nav-text cursor-pointer mb-3 ${
              isMatchFavourite && "text-warning"
            }`}
            icon={faStar}
          />
        )}
      </td>
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
