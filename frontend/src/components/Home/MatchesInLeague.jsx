import { useEffect, useState } from "react";
import API from "../../services/AxiosService";
import {
  getHeaders,
  redirectToLoginIfNeeded,
} from "../../services/AuthService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { v4 as uuid } from "uuid";
import Match from "./Match";
import { useResultContext } from "../../context/ResultContext";

export default function MatchesInLeague({ league }) {
  const [matches, setMatches] = useState([]);
  const navigate = useNavigate();
  const { selectedDate } = useResultContext();

  useEffect(() => {
    async function getMatches() {
      try {
        const response = await API.get(
          `/match?LeagueId=${league.id}&time=${selectedDate}`,
          {
            headers: getHeaders(),
          }
        );
        setMatches(response.data.items);
      } catch (err) {
        console.log(err);
        redirectToLoginIfNeeded(err, navigate, toast);
      }
    }
    getMatches();
  }, []);

  if (matches.length === 0) return null;

  return (
    <div className="container my-5">
      <table className="table table-borderless table-hover">
        <caption>{league.name}</caption>
        <tbody>
          {matches.map((match) => {
            return <Match key={uuid()} match={match} />;
          })}
        </tbody>
      </table>
    </div>
  );
}
