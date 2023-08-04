import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getMatchByIdAsync } from "../services/MatchService";
import {
  extractDate,
  extractHoursAndMinutes,
} from "../services/DateTimeService";
import Club from "../components/SingleMatch/Club";
import CommentSection from "../components/SingleMatch/CommentSection";
import Navbar from "../components/Navbar";

export default function SingleMatch() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [match, setMatch] = useState(null);
  useEffect(() => {
    async function getSingleMatchAsync() {
      const match = await getMatchByIdAsync(id, navigate);
      if (!match) {
        navigate("/home");
        return;
      }
      setMatch(match);
    }
    getSingleMatchAsync();
  }, []);

  if (!match) return null;

  return (
    <>
      <Navbar />
      <div className="container mt-5 d-flex flex-column">
        <div className="row row-cols-3">
          <Club club={match.clubHome} />
          <div className="col text-center d-flex justify-content-center align-items-center flex-column gap-3">
            <div>
              <span>{extractDate(match.time)}</span>
              <span className="mx-2">{extractHoursAndMinutes(match.time)}</span>
            </div>
            <div className="display-4">
              {match.homeScore !== null && <span>{match.homeScore}</span>}
              <span>-</span>
              {match.awayScore !== null && <span>{match.awayScore}</span>}
            </div>
            <span>{match.location.name}</span>
          </div>
          <Club club={match.clubAway} />
        </div>
        <CommentSection matchId={id} />
      </div>
    </>
  );
}
