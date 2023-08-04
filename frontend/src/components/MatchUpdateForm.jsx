import React, { useEffect, useState } from "react";
import Select from "./Select";
import Input from "./Input";
import Form from "./Form";
import ControlledInput from "./ControlledInput";
import { getLeagueByIdAsync } from "../services/LeagueService";
import { getLocationsAsync } from "../services/LocationService";
import { getClubsFilteredByLeagueAsync } from "../services/ClubService";
import { useNavigate } from "react-router-dom";
import { useResultContext } from "../context/ResultContext";

export default function MatchUpdateForm({ onSubmit, selectedMatch }) {
  const [locations, setLocations] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [selectedSportName, setSelectedSportName] = useState("");
  const [selectedLeagueName, setSelectedLeagueName] = useState("");
  const [selectedTimeId, setSelectedTimeId] = useState("");
  const [selectedLocationId, setSelectedLocationId] = useState("");
  const [selectedClubHomeId, setSelectedClubHomeId] = useState("");
  const [selectedClubAwayId, setSelectedClubAwayId] = useState("");
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
      fetchLocationsAsync();
      setDataFromSelectedMatch();
    }
  }, [selectedMatch?.id]);

  async function setDataFromSelectedMatch() {
    const league = await getLeagueByIdAsync(
      selectedMatch.clubHome.leagueId,
      navigate
    );
    setSelectedTimeId(selectedMatch.time);
    setSelectedSportName(league.sport.name);
    setSelectedLeagueName(league.name);
    setSelectedClubHomeId(selectedMatch.clubHomeId);
    setHomeScore(selectedMatch.homeScore || "");
    setAwayScore(selectedMatch.awayScore || "");
    setSelectedClubAwayId(selectedMatch.clubAwayId);
    setSelectedLocationId(selectedMatch.locationId);

    fetchClubsAsync();
  }

  async function fetchLocationsAsync() {
    const { items } = await getLocationsAsync(navigate, 100, 0);
    setLocations(items);
  }

  async function fetchClubsAsync() {
    if (selectedMatch.clubHome.leagueId === "") return;
    const { items } = await getClubsFilteredByLeagueAsync(navigate, 100, 0, selectedMatch.clubHome.leagueId);
    setClubs(items);
  }

  return (

    <Form handleOnSubmit={onSubmit} className="width-400">
      <ControlledInput
        id="matchTime"
        type="datetime-local"
        value={selectedTimeId}
        isDisabled={isMatchFinished}
        onChange={(e) => setSelectedTimeId(e.target.value)}
        labelText={langParsed.strTime}
      />
      <Input
        type="text"
        isDisabled={true}
        id="matchSport"
        defaultValue={selectedSportName}
        labelText={langParsed.strSport}
      />
      <Input
        type="text"
        isDisabled={true}
        id="matchLeague"
        defaultValue={selectedLeagueName}
        labelText={langParsed.strLeague}
      />
      <Select
        id="matchClubHome"
        value={selectedClubHomeId}
        isDisabled={isMatchFinished}
        onChange={(e) => setSelectedClubHomeId(e.target.value)}
        options={clubs.filter((club) => club.id !== selectedClubAwayId)}
        labelText={langParsed.strHome}
      />
      <Select
        id="matchClubAway"
        value={selectedClubAwayId}
        isDisabled={isMatchFinished}
        onChange={(e) => setSelectedClubAwayId(e.target.value)}
        options={clubs.filter((club) => club.id !== selectedClubHomeId)}
        labelText={langParsed.strAway}
      />
      <Select
        id="matchLocation"
        value={selectedLocationId}
        isDisabled={isMatchFinished}
        onChange={(e) => setSelectedLocationId(e.target.value)}
        options={locations}
        labelText={langParsed.strLocation}
      />
      <ControlledInput
        type="number"
        value={homeScore}
        isDisabled={!isMatchFinished}
        onChange={(e) => setHomeScore(e.target.value)}
        id="matchHomeScore"
        labelText={langParsed.strScoreHome}
      />
      <ControlledInput
        type="number"
        value={awayScore}
        isDisabled={!isMatchFinished}
        onChange={(e) => setAwayScore(e.target.value)}
        id="matchAwayScore"
        labelText={langParsed.strScoreAway}
      />
    </Form>
  );
}
