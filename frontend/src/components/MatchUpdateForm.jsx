import React, { useEffect, useState } from "react";
import Select from "./Select";
import Input from "./Input";
import Form from "./Form";
import ControlledInput from "./ControlledInput";
import API from "../services/AxiosService";
import { v4 as uuid } from "uuid";
import { getHeaders } from "../services/AuthService";

export default function MatchCreateForm({ onSubmit, selectedMatch }) {
  const [locations, setLocations] = useState([]);
  const [selectedSport, setSelectedSport] = useState("");
  const [selectedLeague, setSelectedLeague] = useState("");
  const [clubs, setClubs] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedClubHome, setSelectedClubHome] = useState("");
  const [selectedClubAway, setSelectedClubAway] = useState("");
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (selectedMatch) {
      setIsFinished(isMatchFinished(selectedMatch.time, new Date().toISOString()));
      fetchClubsAsync();
      fetchLocationsAsync();
      setDataFromSelectedMatch()
    }
  }, [selectedMatch?.id]);


  async function setDataFromSelectedMatch() {
    try {
      const response = await API.get(`/league/${selectedMatch.clubHome.leagueId}`, {
        headers: getHeaders(),
      })
      setSelectedTime(selectedMatch.time);
      setSelectedSport(response.data.sport.name)
      setSelectedLeague(response.data.name);
      setSelectedClubHome(selectedMatch.clubHomeId);
      setHomeScore(selectedMatch.homeScore);
      setAwayScore(selectedMatch.awayScore);
      setSelectedClubAway(selectedMatch.clubAwayId);
      setSelectedLocation(selectedMatch.locationId);
    } catch (e) {
      console.log(e);
    }
  }

  async function fetchLocationsAsync() {
    try {
      await API.get(`/location`, {
        headers: getHeaders(),
      }).then((response) => {
        setLocations(response.data.items)
      });
    } catch (e) {
      console.log(e);
    }
  }

  async function fetchClubsAsync() {
    if (selectedMatch.leagueId === "") return

    try {
      await API.get(`/club?leagueId=${selectedMatch.leagueId}`, {
        headers: getHeaders(),
      }).then((response) => {
        const clubsFromDatabase = response.data.items
        setClubs(clubsFromDatabase);
      });
    } catch (e) {
      console.log(e);
    }
  }

  function isMatchFinished(matchTime, currentTime) {
    return new Date(matchTime) < new Date(currentTime);
  }

  return (
    <div>
      <Form
        formElements={[
          <ControlledInput
            key={uuid()}
            id="matchTime"
            type="datetime-local"
            value={selectedTime}
            isDisabled={isFinished}
            onChange={(e) => setSelectedTime(e.target.value)}
            labelText="Vrijeme"
          />,
          <Input
            key={uuid()}
            type="text"
            isDisabled={true}
            id="matchSport"
            defaultValue={selectedSport}
            labelText="Sport"
          />,
          <Input
            key={uuid()}
            type="text"
            isDisabled={true}
            id="matchLeague"
            defaultValue={selectedLeague}
            labelText="Liga"
          />,
          <Select
            key={uuid()}
            id="matchClubHome"
            value={selectedClubHome}
            isDisabled={isFinished}
            onChange={(e) => setSelectedClubHome(e.target.value)}
            options={(clubs.filter((club) => club.id !== selectedClubAway))}
            labelText="Domaćin"
          />,
          <Select
            key={uuid()}
            id="matchClubAway"
            value={selectedClubAway}
            isDisabled={isFinished}
            onChange={(e) => setSelectedClubAway(e.target.value)}
            options={(clubs.filter((club) => club.id !== selectedClubHome))}
            labelText="Gost"
          />,
          <Select
            key={uuid()}
            id="matchLocation"
            value={selectedLocation}
            isDisabled={isFinished}
            onChange={(e) => setSelectedLocation(e.target.value)}
            options={locations}
            labelText="Lokacija"
          />,
          <ControlledInput
            key={uuid()}
            type="text"
            value={homeScore}
            isDisabled={!isFinished}
            onChange={(e) => setHomeScore(e.target.value)}
            id="matchHomeScore"
            labelText="Rezultat domaćin"
          />
          ,
          <ControlledInput
            key={uuid()}
            type="text"
            value={awayScore}
            isDisabled={!isFinished}
            onChange={(e) => setAwayScore(e.target.value)}
            id="matchAwayScore"
            labelText="Rezultat gost"
          />
        ]}
        handleOnSubmit={onSubmit}
        className="width-400"
      />
    </div>
  );
}
