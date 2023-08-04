import React from "react";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";
import MatchCreateForm from "../../components/MatchCreateForm"
import { createNewMatchAsync } from "../../services/MatchService"
import Background from "../../components/Background";
import FormContainer from "../../components/FormContainer";

export default function MatchCreate() {
  const navigate = useNavigate()

  async function createMatchAsync(e) {
    e.preventDefault();

    const matchTime = e.target.elements.matchTime.value;
    const matchClubHome = e.target.elements.matchClubHome.value;
    const matchClubAway = e.target.elements.matchClubAway.value;
    const matchLocation = e.target.elements.matchLocation.value;
    const matchHomeScore = e.target.elements.matchHomeScore.value;
    const matchAwayScore = e.target.elements.matchAwayScore.value;
    const matchToCreate = {
      time: matchTime,
      clubHomeId: matchClubHome,
      clubAwayId: matchClubAway,
      locationId: matchLocation,
      homeScore: matchHomeScore,
      awayScore: matchAwayScore,
    };

    await createNewMatchAsync(matchToCreate, navigate);
    navigate("/match");
  }

  return (
    <Background>
      <Navbar />
      <FormContainer>
        <MatchCreateForm onSubmit={createMatchAsync} />
      </FormContainer>
    </Background>
  )
}
