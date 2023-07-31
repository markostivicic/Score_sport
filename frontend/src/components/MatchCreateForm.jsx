import React, { useEffect, useState } from "react";
import Select from "./Select";
import Form from "./Form";
import ControlledInput from "./ControlledInput";
import API from "../services/AxiosService";
import { v4 as uuid } from "uuid";
import { getHeaders } from "../services/AuthService";

export default function MatchUpdateForm({ onSubmit }) {
  const [sports, setSports] = useState([]);
  const [locations, setLocations] = useState([]);
  const [leagues, setLeagues] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [selectedSport, setSelectedSport] = useState("");
  const [selectedLeague, setSelectedLeague] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedClubHome, setSelectedClubHome] = useState("");
  const [selectedClubAway, setSelectedClubAway] = useState("");

  useEffect(() => {
    fetchSportsAsync()
    fetchLocationsAsync()
  }, []);

  useEffect(() => {
    fetchLeaguesAsync();
  }, [selectedSport]);

  useEffect(() => {
    fetchClubsAsync();
  }, [selectedLeague]);


  async function fetchSportsAsync() {
    try {
      await API.get(`/sport`, {
        headers: getHeaders(),
      }).then((response) => {
        const sportsFromDatabase = response.data.items
        setSports(sportsFromDatabase);
        setSelectedSport(sportsFromDatabase.length > 0 ? sportsFromDatabase[0].id : "")
      });
    } catch (e) {
      console.log(e);
    }
  }

  async function fetchLocationsAsync() {
    try {
      await API.get(`/location`, {
        headers: getHeaders(),
      }).then((response) => {
        const locationsFromDatabase = response.data.items
        setLocations(locationsFromDatabase)
        setSelectedLocation(locationsFromDatabase.length > 0 ? locationsFromDatabase[0].id : "")
      });
    } catch (e) {
      console.log(e);
    }
  }

  async function fetchLeaguesAsync() {
    if (selectedSport === "") return

    try {
      await API.get(`/league?sportId=${selectedSport}`, {
        headers: getHeaders(),
      }).then((response) => {
        const leaguesFromDatabase = response.data.items
        setLeagues(leaguesFromDatabase);
        setSelectedLeague(leaguesFromDatabase.length > 0 ? leaguesFromDatabase[0].id : "")
      });
    } catch (e) {
      console.log(e);
    }
  }

  async function fetchClubsAsync() {
    if (selectedLeague === "") return

    try {
      await API.get(`/club?leagueId=${selectedLeague}`, {
        headers: getHeaders(),
      }).then((response) => {
        const clubsFromDatabase = response.data.items
        setClubs(clubsFromDatabase);
        setSelectedClubHome(clubsFromDatabase.length > 0 ? clubsFromDatabase[0].id : "");
        setSelectedClubAway(clubsFromDatabase.length > 1 ? clubsFromDatabase[1].id : "");
      });
    } catch (e) {
      console.log(e);
    }
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
            onChange={(e) => setSelectedTime(e.target.value)}
            labelText="Vrijeme"
          />,
          <Select
            key={uuid()}
            id="matchSport"
            options={sports}
            value={selectedSport}
            onChange={(e) => setSelectedSport(e.target.value)}
            labelText="Sport"
          />,
          <Select
            key={uuid()}
            id="matchLeague"
            options={leagues}
            value={selectedLeague}
            onChange={(e) => setSelectedLeague(e.target.value)}
            labelText="Liga"
          />,
          <Select
            key={uuid()}
            id="matchClubHome"
            value={selectedClubHome}
            onChange={(e) => setSelectedClubHome(e.target.value)}
            options={(clubs.filter((club) => club.id !== selectedClubAway))}
            labelText="Domaćin"
          />,
          <Select
            key={uuid()}
            id="matchClubAway"
            value={selectedClubAway}
            onChange={(e) => setSelectedClubAway(e.target.value)}
            options={(clubs.filter((club) => club.id !== selectedClubHome))}
            labelText="Gost"
          />,
          <Select
            key={uuid()}
            id="matchLocation"
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            options={locations}
            labelText="Lokacija"
          />
        ]}
        handleOnSubmit={onSubmit}
        className="width-400"
      />
    </div>
  );
}
