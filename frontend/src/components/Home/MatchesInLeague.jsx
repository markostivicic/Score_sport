import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Match from "./Match";
import { useResultContext } from "../../context/ResultContext";
import { getMatchesFilteredByLeagueAndDateAsync } from "../../services/MatchService";

export default function MatchesInLeague({ league }) {
  const [matches, setMatches] = useState([]);
  const navigate = useNavigate();
  const { selectedDate } = useResultContext();

  useEffect(() => {
    async function getMatchesAsync() {
      const { items } = await getMatchesFilteredByLeagueAndDateAsync(
        navigate,
        100,
        0,
        league.id,
        selectedDate
      );
      setMatches(items);
    }
    getMatchesAsync();
  }, [selectedDate]);

  if (matches.length === 0) return null;

  return (
    <div className="container my-5">
      <table className="table table-borderless table-hover">
        <caption className="text-primary">
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
