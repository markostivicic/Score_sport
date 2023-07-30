import React from "react";
import { useEffect } from "react";
import { useResultContext } from "../../context/ResultContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MatchesInLeague from "./MatchesInLeague";
import { getLeaguesFilteredBySportAsync } from "../../services/LeagueService";

export default function Leagues() {
  const { currentSport } = useResultContext();
  const [leagues, setLeagues] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function getLeaguesAsync() {
      const { items } = await getLeaguesFilteredBySportAsync(
        navigate,
        100,
        0,
        currentSport?.id
      );
      setLeagues(items);
    }
    getLeaguesAsync();
  }, [currentSport?.id]);
  return (
    <div>
      {leagues.map((league) => {
        return <MatchesInLeague key={league.id} league={league} />;
      })}
    </div>
  );
}
