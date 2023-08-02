import React, { useEffect, useState } from "react";
import Select from "./Select";
import Input from "./Input";
import Form from "./Form";
import ControlledInput from "./ControlledInput";
import { getLeagueByIdAsync } from "../services/LeagueService";
import { getLocationsAsync } from "../services/LocationService";
import { getClubsAsync } from "../services/ClubService";
import { useNavigate } from "react-router-dom";
import { useResultContext } from "../context/ResultContext";

export default function MatchUpdateForm({ onSubmit, selectedMatch }) {
  const [locations, setLocations] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [selectedSportId, setselectedSportId] = useState("");
  const [selectedLeagueId, setselectedLeagueId] = useState("");
  const [selectedTimeId, setselectedTimeId] = useState("");
  const [selectedLocationId, setselectedLocationId] = useState("");
  const [selectedClubHomeId, setselectedClubHomeId] = useState("");
  const [selectedClubAwayId, setselectedClubAwayId] = useState("");
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [isMatchFinished, setIsMatchFinished] = useState(false);
  const { lang } = useResultContext();

  const langParsed = JSON.parse(lang);

  const navigate = useNavigate();

  useEffect(() => {
    if (selectedMatch) {
      setIsMatchFinished(
        new Date(selectedMatch.time) < new Date(new Date().toISOString())
      );
      fetchClubsAsync();
      fetchLocationsAsync();
      setDataFromSelectedMatch();
    }
  }, [selectedMatch?.id]);

  async function setDataFromSelectedMatch() {
    const league = await getLeagueByIdAsync(
      selectedMatch.clubHome.leagueId,
      navigate
    );
    setselectedTimeId(selectedMatch.time);
    setselectedSportId(league.sport.name);
    setselectedLeagueId(league.name);
    setselectedClubHomeId(selectedMatch.clubHomeId);
    setHomeScore(selectedMatch.homeScore);
    setAwayScore(selectedMatch.awayScore);
    setselectedClubAwayId(selectedMatch.clubAwayId);
    setselectedLocationId(selectedMatch.locationId);
  }

  async function fetchLocationsAsync() {
    const { items } = await getLocationsAsync(navigate, 100, 0);
    setLocations(items);
  }

  async function fetchClubsAsync() {
    if (selectedMatch.leagueId === "") return;
    const { items } = await getClubsAsync(navigate, 100, 0);
    setClubs(items);
  }

  return (
    <Form handleOnSubmit={onSubmit} className="width-400">
      <ControlledInput
        id="matchTime"
        type="datetime-local"
        value={selectedTimeId}
        isDisabled={isMatchFinished}
        onChange={(e) => setselectedTimeId(e.target.value)}
        labelText={langParsed.strTime}
      />
      <Input
        type="text"
        isDisabled={true}
        id="matchSport"
        defaultValue={selectedSportId}
        labelText={langParsed.strSport}
      />
      <Input
        type="text"
        isDisabled={true}
        id="matchLeague"
        defaultValue={selectedLeagueId}
        labelText={langParsed.strLeague}
      />
      <Select
        id="matchClubHome"
        value={selectedClubHomeId}
        isDisabled={isMatchFinished}
        onChange={(e) => setselectedClubHomeId(e.target.value)}
        options={clubs.filter((club) => club.id !== selectedClubAwayId)}
        labelText={langParsed.strHome}
      />
      <Select
        id="matchClubAway"
        value={selectedClubAwayId}
        isDisabled={isMatchFinished}
        onChange={(e) => setselectedClubAwayId(e.target.value)}
        options={clubs.filter((club) => club.id !== selectedClubHomeId)}
        labelText={langParsed.strAway}
      />
      <Select
        id="matchLocation"
        value={selectedLocationId}
        isDisabled={isMatchFinished}
        onChange={(e) => setselectedLocationId(e.target.value)}
        options={locations}
        labelText={langParsed.strLocation}
      />
      <ControlledInput
        type="text"
        pattern="[0-9]*"
        value={homeScore}
        isDisabled={!isMatchFinished}
        onChange={(e) => setHomeScore(e.target.value)}
        id="matchHomeScore"
        labelText={langParsed.strScoreHome}
      />
      <ControlledInput
        type="text"
        pattern="[0-9]*"
        value={awayScore}
        isDisabled={!isMatchFinished}
        onChange={(e) => setAwayScore(e.target.value)}
        id="matchAwayScore"
        labelText={langParsed.strScoreAway}
      />
    </Form>
  );
}
