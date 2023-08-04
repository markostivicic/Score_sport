import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Form from "../../components/Form";
import Input from "../../components/Input";
import Select from "../../components/Select";
import {
  getClubByIdAsync,
  updateClubByIdAsync,
} from "../../services/ClubService";
import { getSportByIdAsync, getSportsAsync } from "../../services/SportService";
import { getLeaguesFilteredBySportAsync } from "../../services/LeagueService";
import {
  getLocationByIdAsync,
  getLocationsAsync,
} from "../../services/LocationService";
import Background from "../../components/Background";
import FormContainer from "../../components/FormContainer";
import { useResultContext } from "../../context/ResultContext";

export default function ClubUpdate() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [selectedClub, setSelectedClub] = useState();
  const [sports, setSports] = useState([]);
  const [selectedSportId, setSelectedSportId] = useState("");
  const [leagues, setLeagues] = useState([]);
  const [selectedLeague, setSelectedLeague] = useState({});
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState({});
  const { lang } = useResultContext();

  const langParsed = JSON.parse(lang);

  useEffect(() => {
    if (id === "") {
      navigate("/club");
    }
    getClubAsync();
    fetchSportsAsync();
  }, []);

  useEffect(() => {
    if (id === "") {
      navigate("/club");
    }
    fetchSportsAsync();
    fetchLocationsAsync();
  }, [selectedClub?.id]);

  useEffect(() => {
    fetchLeaguesAsync();
  }, [selectedSportId]);

  async function getClubAsync() {
    const data = await getClubByIdAsync(id, navigate);
    setSelectedClub(data);
    setSelectedLeague(data.leagueId);
  }
  async function fetchSportsAsync() {
    const { items } = await getSportsAsync(navigate, 100, 0);
    setSports(items);
    if (!selectedClub) return;
    const initialSport = await getSportByIdAsync(
      selectedClub.league.sportId,
      navigate
    );
    setSelectedSportId(initialSport.id);
  }
  async function fetchLeaguesAsync() {
    const { items } = await getLeaguesFilteredBySportAsync(
      navigate,
      100,
      0,
      selectedSportId
    );
    setLeagues(items);
  }

  async function fetchLocationsAsync() {
    const { items } = await getLocationsAsync(navigate, 100, 0);
    setLocations(items);
    if (!selectedClub) return;
    const initialLocation = await getLocationByIdAsync(
      selectedClub.locationId,
      navigate
    );
    setSelectedLocation(initialLocation.id);
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

    await updateClubByIdAsync(id, clubToUpdate, navigate);
    navigate("/club");
  }

  return (
    <Background>
      <Navbar />
      <FormContainer>
        <Form handleOnSubmit={updateClubAsync}>
          <Input
            id="clubCreateName"
            type="text"
            labelText={langParsed.strName}
            defaultValue={selectedClub?.name}
          />
          <Input
            id="clubCreateLogo"
            type="url"
            labelText={langParsed.strLogo}
            defaultValue={selectedClub?.logo}
          />
          <Select
            id="clubCreateSport"
            options={sports}
            value={selectedSportId}
            onChange={(e) => setSelectedSportId(e.target.value)}
            labelText={langParsed.strSport}
          />
          <Select
            id="clubCreateLeague"
            options={leagues}
            value={selectedLeague}
            onChange={(e) => setSelectedLeague(e.target.value)}
            labelText={langParsed.strLeague}
          />
          <Select
            id="clubCreateLocation"
            value={selectedLocation}
            options={locations}
            onChange={(e) => setSelectedLocation(e.target.value)}
            labelText={langParsed.strLocation}
          />
        </Form>
      </FormContainer>
    </Background>
  );
}
