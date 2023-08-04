import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import {
  changeFavouriteClubStatusAsync,
  getFavouriteClubByClubIdAsync,
} from "../../services/FavouriteClubService";
import { useNavigate } from "react-router-dom";

export default function Club({ club }) {
  const [isClubFavourite, setIsClubFavourite] = useState(null);
  const navigate = useNavigate();

  async function handleToggleFavouriteClub() {
    await changeFavouriteClubStatusAsync(navigate, !isClubFavourite, club.id);
    setIsClubFavourite(!isClubFavourite);
  }

  useEffect(() => {
    async function getFavouriteClubAsync() {
      const favouriteClub = await getFavouriteClubByClubIdAsync(
        navigate,
        club.id,
        true
      );
      setIsClubFavourite(favouriteClub !== null);
    }
    getFavouriteClubAsync();
  }, [isClubFavourite]);
  return (
    <div className="col d-flex justify-content-center gap-3 align-items-center">
      {isClubFavourite !== null && (
        <FontAwesomeIcon
          className={`display-6 cursor-pointer mb-3 ${
            isClubFavourite && "text-warning"
          }`}
          icon={faStar}
          onClick={handleToggleFavouriteClub}
        />
      )}

      <div className="d-flex flex-column align-items-center">
        <img
          onClick={() => navigate(`/single-club/${club.id}`)}
          className="club-logo cursor-pointer"
          src={club.logo}
          alt="club-home-logo"
        />
        <span>{club.name}</span>
      </div>
    </div>
  );
}
