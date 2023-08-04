import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { useNavigate, useParams } from "react-router-dom";
import MatchUpdateForm from "../../components/MatchUpdateForm"
import { getMatchByIdAsync, updateMatchByIdAsync } from "../../services/MatchService"
import Background from "../../components/Background";
import FormContainer from "../../components/FormContainer";

export default function MatchUpdate() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [selectedMatch, setSelectedMatch] = useState(null);

  useEffect(() => {
    if (id === "") {
      navigate("/match");
    }
    getMatchAsync();
  }, []);


  async function getMatchAsync() {
    const data = await getMatchByIdAsync(id, navigate);
    setSelectedMatch(data);
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

    await updateMatchByIdAsync(id, matchToUpdate);
    navigate("/match");
  }

  return (
    <Background>
      <Navbar />
      <FormContainer>
        <MatchUpdateForm selectedMatch={selectedMatch} onSubmit={updateMatchAsync} />
      </FormContainer>
    </Background>
  )
}
