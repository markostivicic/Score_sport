import React, { useEffect, useState } from "react";
import Select from "./Select";
import Form from "./Form";
import ControlledInput from "./ControlledInput";
import { getSportsAsync } from "../services/SportService";
import { getLocationsAsync } from "../services/LocationService";
import { getLeaguesFilteredBySportAsync } from "../services/LeagueService";
import { getClubsFilteredByLeagueAsync } from "../services/ClubService";
import { useNavigate } from "react-router-dom";
import { useResultContext } from "../context/ResultContext";

export default function MatchCreateForm({ onSubmit }) {
  const [sports, setSports] = useState([]);
  const [locations, setLocations] = useState([]);
  const [leagues, setLeagues] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [selectedSportId, setSelectedSportId] = useState("");
  const [selectedLeagueId, setSelectedLeagueId] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedClubHomeId, setselectedClubHomeId] = useState("");
  const [selectedClubAwayId, setSelectedClubAwayId] = useState("");
  const [homeScore, setHomeScore] = useState("");
  const [awayScore, setAwayScore] = useState("");
  const [isMatchFinished, setIsMatchFinished] = useState(false);
  const { lang } = useResultContext();

  const langParsed = JSON.parse(lang);

  const navigate = useNavigate();

  useEffect(() => {
    fetchSportsAsync();
    fetchLocationsAsync();
  }, []);

  useEffect(() => {
    fetchLeaguesAsync();
  }, [selectedSportId]);

  useEffect(() => {
    fetchClubsAsync();
  }, [selectedLeagueId]);

  useEffect(() => {
    setIsMatchFinished(
      new Date(selectedTime) < new Date(new Date().toISOString())
    );
  }, [selectedTime]);

  async function fetchSportsAsync() {
    const { items } = await getSportsAsync(navigate, 100, 0);
    setSports(items);
    setSelectedSportId(items.length > 0 ? items[0].id : "");
  }

  async function fetchLocationsAsync() {
    const { items } = await getLocationsAsync(navigate, 100, 0);
    setLocations(items);
    setSelectedLocation(items.length > 0 ? items[0].id : "");
  }

  async function fetchLeaguesAsync() {
    if (selectedSportId === "") return;
    const { items } = await getLeaguesFilteredBySportAsync(
      navigate,
      100,
      0,
      selectedSportId
    );
    setLeagues(items);
    setSelectedLeagueId(items.length > 0 ? items[0].id : "");
  }

  async function fetchClubsAsync() {
    if (selectedLeagueId === "") return;
    const { items } = await getClubsFilteredByLeagueAsync(
      navigate,
      100,
      0,
      selectedLeagueId
    );
    setClubs(items);
    setselectedClubHomeId(items.length > 0 ? items[0].id : "");
    setSelectedClubAwayId(items.length > 1 ? items[1].id : "");
  }

  return (
    <Form handleOnSubmit={onSubmit} className="width-400">
      <ControlledInput
        id="matchTime"
        type="datetime-local"
        value={selectedTime}
        onChange={(e) => setSelectedTime(e.target.value)}
        labelText={langParsed.strTime}
      />
      <Select
        id="matchSport"
        options={sports}
        value={selectedSportId}
        onChange={(e) => setSelectedSportId(e.target.value)}
        labelText={langParsed.strSport}
      />
      <Select
        id="matchLeague"
        options={leagues}
        value={selectedLeagueId}
        onChange={(e) => setSelectedLeagueId(e.target.value)}
        labelText={langParsed.strLeague}
      />
      <Select
        id="matchClubHome"
        value={selectedClubHomeId}
        onChange={(e) => setselectedClubHomeId(e.target.value)}
        options={clubs.filter((club) => club.id !== selectedClubAwayId)}
        labelText={langParsed.strHome}
      />
      <Select
        id="matchClubAway"
        value={selectedClubAwayId}
        onChange={(e) => setSelectedClubAwayId(e.target.value)}
        options={clubs.filter((club) => club.id !== selectedClubHomeId)}
        labelText={langParsed.strAway}
      />
      <Select
        id="matchLocation"
        value={selectedLocation}
        onChange={(e) => setSelectedLocation(e.target.value)}
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
