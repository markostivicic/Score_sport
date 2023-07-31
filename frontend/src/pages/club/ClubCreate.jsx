import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Form from "../../components/Form";
import Input from "../../components/Input";
import API from "../../services/AxiosService";
import { toast } from "react-toastify";
import { v4 as uuid } from "uuid";
import { getHeaders } from "../../services/AuthService";
import Select from "../../components/Select";

export default function ClubCreate() {
  const navigate = useNavigate();
  const [sports, setSports] = useState([]);
  const [selectedSport, setSelectedSport] = useState("");
  const [leagues, setLeagues] = useState([]);
  const [selectedLeague, setSelectedLeague] = useState({});
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    fetchSportsAsync();
    fetchLeaguesAsync();
    fetchLocationsAsync();
  }, []);

  useEffect(() => {
    fetchLeaguesAsync();
  }, [selectedSport]);

  useEffect(() => {
    fetchLocationsAsync();
  }, [selectedLeague]);

  async function createClubAsync(e) {
    e.preventDefault();

    const clubName = e.target.elements.clubCreateName.value;
    const clubLogo = e.target.elements.clubCreateLogo.value;
    const clubLeague = e.target.elements.clubCreateLeague.value;
    const clubLocation = e.target.elements.clubCreateLocation.value;
    const clubToUpdate = {
      name: clubName,
      logo: clubLogo,
      leagueId: clubLeague,
      locationId: clubLocation,
    };

    try {
      await API.post(`/club`, clubToUpdate, {
        headers: getHeaders(),
      }).then(() => {
        toast.success("Klub kreiran");
        navigate("/club");
      });
    } catch (e) {
      toast.error("Klub nije kreiran");
      console.log(e);
    }
  }

  async function fetchSportsAsync() {
    try {
      await API.get(`/sport`, {
        headers: getHeaders(),
      }).then((response) => {
        const sportsFromDatabase = response.data.items;
        setSports(sportsFromDatabase);
        setSelectedSport(
          sportsFromDatabase.length > 0
            ? sportsFromDatabase[0].id
            : navigate("/club")
        );
      });
    } catch (e) {
      console.log(e);
    }
  }
  async function fetchLeaguesAsync() {
    if (selectedSport === "") return;
    try {
      await API.get(`/league?sportId=${selectedSport}`, {
        headers: getHeaders(),
      }).then((response) => {
        const leaguesFromDatabase = response.data.items;
        console.log(response.data.items);
        setLeagues(leaguesFromDatabase);
        setSelectedLeague(
          leaguesFromDatabase.length > 0
            ? leaguesFromDatabase[0]
            : navigate("/club")
        );
      });
    } catch (e) {
      console.log(e);
    }
  }

  async function fetchLocationsAsync() {
    if (selectedLeague === "") return;
    try {
      await API.get(`/location?countryId=${selectedLeague.countryId}`, {
        headers: getHeaders(),
      }).then((response) => {
        const locationsFromDatabase = response.data.items;
        setLocations(locationsFromDatabase);
      });
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div>
      <Navbar />
      <Form
        formElements={[
          <Input
            key={uuid()}
            id="clubCreateName"
            type="text"
            labelText="Ime"
          />,
          <Input
            key={uuid()}
            id="clubCreateLogo"
            type="url"
            labelText="Logo"
          />,
          <Select
            key={uuid()}
            id="clubCreateSport"
            options={sports}
            value={selectedSport}
            onChange={(e) => setSelectedSport(e.target.value)}
            labelText="Sport"
          />,
          <Select
            key={uuid()}
            id="clubCreateLeague"
            options={leagues}
            value={selectedLeague}
            onChange={(e) => setSelectedLeague(e.target.value)}
            labelText="Liga"
          />,
          <Select
            key={uuid()}
            id="clubCreateLocation"
            options={locations}
            labelText="Lokacije"
          />,
        ]}
        handleOnSubmit={createClubAsync}
        className="width-400"
      />
    </div>
  );
}
