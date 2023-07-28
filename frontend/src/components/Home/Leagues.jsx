import React from "react";
import { useEffect } from "react";
import API from "../../services/AxiosService";
import { useResultContext } from "../../context/ResultContext";
import { useState } from "react";
import {
  getHeaders,
  redirectToLoginIfNeeded,
} from "../../services/AuthService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import MatchesInLeague from "./MatchesInLeague";
import { v4 as uuid } from "uuid";

export default function Leagues() {
  const { currentSport } = useResultContext();
  const [leagues, setLeagues] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function getLeagues() {
      try {
        const response = await API.get(
          `/league?SportId=${currentSport ? currentSport.id : ""}`,
          {
            headers: getHeaders(),
          }
        );
        setLeagues(response.data.items);
        console.log(response.data.items);
      } catch (err) {
        console.log(err);
        redirectToLoginIfNeeded(err, navigate, toast);
      }
    }
    getLeagues();
  }, [currentSport?.id]);
  return (
    <div>
      {leagues.map((league) => {
        return <MatchesInLeague key={uuid()} league={league} />;
      })}
    </div>
  );
}
