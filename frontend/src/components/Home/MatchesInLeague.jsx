import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Match from "./Match";
import { useResultContext } from "../../context/ResultContext";
import { getMatchesFilteredByLeagueAndDateAsync } from "../../services/MatchService";
import { getFavouriteMatchsAsync } from "../../services/FavouriteMatchService";
import { getFavouriteClubsAsync } from "../../services/FavouriteClubService";

export default function MatchesInLeague({ league }) {
  const [matches, setMatches] = useState([]);
  const navigate = useNavigate();
  const { selectedDate, currentSport, lang } = useResultContext();
  const langParsed = JSON.parse(lang);

  useEffect(() => {
    async function getMatchesAsync() {
      const favouriteClubs = await getFavouriteClubsAsync(navigate, 500, 0);
      const favouriteMatches = await getFavouriteMatchsAsync(navigate, 500, 0);
      let { items } = await getMatchesFilteredByLeagueAndDateAsync(
        navigate,
        100,
        0,
        league.id,
        selectedDate
      );

      if (currentSport.name !== langParsed.strFavourites) {
        setMatches(items);
        return;
      }

      items = items.filter(
        (match) =>
          favouriteClubs.items.some(
            (favouriteClub) =>
              match.clubHome.id === favouriteClub.clubId ||
              match.clubAway.id === favouriteClub.clubId
          ) ||
          favouriteMatches.items.some(
            (favouriteMatch) => favouriteMatch.matchId === match.id
          )
      );
      setMatches(items);
    }

    getMatchesAsync();
  }, [selectedDate, currentSport?.id]);

  if (matches.length === 0) return null;

  return (
    <div className="container my-5">
      <table className="table table-borderless table-hover">
        <caption
          onClick={() => navigate(`/single-league/${league.id}`)}
          className="text-primary cursor-pointer"
        >
          <strong>{league.name}</strong>
        </caption>
        <tbody>
          {matches.map((match) => {
            return <Match key={match.id} match={match} />;
          })}
        </tbody>
      </table>
    </div>
  );
}
