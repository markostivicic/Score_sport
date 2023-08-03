import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Form from "../../components/Form";
import Input from "../../components/Input";
import Select from "../../components/Select";
import { getSportsAsync } from "../../services/SportService";
import { createNewClubAsync } from "../../services/ClubService";
import { getLeaguesFilteredBySportAsync } from "../../services/LeagueService";
import { getLocationsAsync } from "../../services/LocationService";
import Background from "../../components/Background";
import FormContainer from "../../components/FormContainer";
import { useResultContext } from "../../context/ResultContext";

export default function ClubCreate() {
  const navigate = useNavigate();
  const [sports, setSports] = useState([]);
  const [selectedSport, setSelectedSport] = useState("");
  const [leagues, setLeagues] = useState([]);
  const [selectedLeague, setSelectedLeague] = useState({});
  const [locations, setLocations] = useState([]);
  const { lang } = useResultContext();

  const langParsed = JSON.parse(lang);

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
    const clubToCreate = {
      name: clubName,
      logo: clubLogo,
      leagueId: clubLeague,
      locationId: clubLocation,
    };

    await createNewClubAsync(clubToCreate, navigate);
    navigate("/club");
  }

  async function fetchSportsAsync() {
    const { items } = await getSportsAsync(navigate, 100, 0);
    setSports(items);
    setSelectedSport(items.length > 0 ? items[0].id : "");
  }
  async function fetchLeaguesAsync() {
    const { items } = await getLeaguesFilteredBySportAsync(navigate, 100, 0, selectedSport);
    setLeagues(items);
  }

  async function fetchLocationsAsync() {
    const { items } = await getLocationsAsync(navigate, 100, 0);
    setLocations(items);
  }

  return (
    <Background>
      <Navbar />
      <FormContainer>
        <Form handleOnSubmit={createClubAsync}>
          <Input
            id="clubCreateName"
            type="text"
            labelText={langParsed.strName}
          />
          <Input
            id="clubCreateLogo"
            type="url"
            labelText={langParsed.strLogo}
          />
          <Select
            id="clubCreateSport"
            options={sports}
            value={selectedSport}
            onChange={(e) => setSelectedSport(e.target.value)}
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
            options={locations}
            labelText={langParsed.strLocation}
          />
        </Form>
      </FormContainer>
    </Background>
  );
}
