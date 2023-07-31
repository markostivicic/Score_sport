import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Form from "../../components/Form";
import Input from "../../components/Input";
import API from "../../services/AxiosService";
import { toast } from "react-toastify";
import { v4 as uuid } from "uuid";
import Select from "../../components/Select";
import { getHeaders } from "../../services/AuthService";

export default function ClubUpdate() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [selectedClub, setSelectedClub] = useState();
  const [sports, setSports] = useState([]);
  const [selectedSport, setSelectedSport] = useState("");
  const [leagues, setLeagues] = useState([]);
  const [selectedLeague, setSelectedLeague] = useState({});
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    if (id === "") {
      navigate("/club");
    }
    getClubByIdAsync();
  }, []);

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

  async function getClubByIdAsync() {
    try {
      await API.get(`/club/${id}`, {
        headers: getHeaders(),
      }).then((response) => {
        setSelectedClub(response.data);
      });
    } catch (e) {
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

  async function updateClubAsync(e) {
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
      await API.put(`/club/${id}`, clubToUpdate, {
        headers: getHeaders(),
      }).then(() => {
        toast.success("Klub ažuriran");
        navigate("/club");
      });
    } catch (e) {
      toast.error("Klub nije ažuriran");
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
            labelText="Name"
            defaultValue={selectedClub?.name}
          />,
          <Input
            key={uuid()}
            id="clubCreateLogo"
            type="url"
            labelText="Logo"
            defaultValue={selectedClub?.logo}
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
        handleOnSubmit={updateClubAsync}
        className="width-400"
      />
    </div>
  );
}
