import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import API from "../../services/AxiosService";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getHeaders } from "../../services/AuthService";
import MatchUpdateForm from "../../components/MatchUpdateForm"

export default function MatchUpdate() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [selectedMatch, setSelectedMatch] = useState(null);

  useEffect(() => {
    if (id === "") {
      navigate("/match");
    }
    getMatchByIdAsync();
  }, []);

  async function getMatchByIdAsync() {
    try {
      await API.get(`/match/${id}`, {
        headers: getHeaders(),
      }).then((response) => {
        setSelectedMatch(response.data);
      });
    } catch (e) {
      console.log(e);
    }
  }

  async function updateMatchAsync(e) {
    e.preventDefault();

    const matchTime = e.target.elements.matchTime.value;
    const matchClubHome = e.target.elements.matchClubHome.value;
    const matchClubAway = e.target.elements.matchClubAway.value;
    const matchLocation = e.target.elements.matchLocation.value;
    const matchHomeScore = e.target.elements.matchHomeScore.value;
    const matchAwayScore = e.target.elements.matchAwayScore.value;
    const matchToUpdate = {
      time: matchTime,
      clubHomeId: matchClubHome,
      clubAwayId: matchClubAway,
      locationId: matchLocation,
      homeScore: matchHomeScore,
      awayScore: matchAwayScore,
    };

    try {
      await API.put(`/match/${id}`, matchToUpdate, {
        headers: getHeaders(),
      }).then(() => {
        toast.success("Utakmica azurirana");
        navigate("/match");
      });
    } catch (e) {
      toast.error("Utakmica nije azurirana");
      console.log(e);
    }
  }

  return (
    <div>
      <Navbar />
      <MatchUpdateForm selectedMatch={selectedMatch} onSubmit={updateMatchAsync} />
    </div>
  )
}
