import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Form from "../../components/Form";
import Input from "../../components/Input";
import Select from "../../components/Select";
import Background from "../../components/Background";
import FormContainer from "../../components/FormContainer";
import {
  getLeagueByIdAsync,
  updateLeagueByIdAsync,
} from "../../services/LeagueService";
import { getCountriesAsync } from "../../services/CountryService";
import { getSportsAsync } from "../../services/SportService";
import { useResultContext } from "../../context/ResultContext";

export default function LeagueUpdate() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [selectedLeague, setSelectedLeague] = useState();
  const [countries, setCountries] = useState([]);
  const [sports, setSports] = useState([]);
  const { lang } = useResultContext();

  const langParsed = JSON.parse(lang);

  useEffect(() => {
    if (id === "") {
      navigate("/league");
    }
    getLeagueAsync();
    fetchSportsAsync();
    fetchCountriesAsync();
  }, []);

  async function getLeagueAsync() {
    const data = await getLeagueByIdAsync(id, navigate);
    setSelectedLeague(data);
  }

  async function updateLeagueAsync(e) {
    e.preventDefault();

    const leagueName = e.target.elements.leagueUpdateName.value;
    const leagueSport = e.target.elements.leagueUpdateSport.value;
    const leagueCountry = e.target.elements.leagueUpdateCountry.value;
    const leagueToUpdate = {
      name: leagueName,
      sportId: leagueSport,
      countryId: leagueCountry,
    };

    await updateLeagueByIdAsync(id, leagueToUpdate);
    navigate("/league");
  }

  async function fetchCountriesAsync() {
    const { items } = await getCountriesAsync(navigate, 100, 0);
    setCountries(items);
  }
  async function fetchSportsAsync() {
    const { items } = await getSportsAsync(navigate, 100, 0);
    setSports(items);
  }

  return (
    <Background>
      <Navbar />
      <FormContainer>
        <Form handleOnSubmit={updateLeagueAsync}>
          <Input
            id="leagueUpdateName"
            type="text"
            labelText={langParsed.strName}
            defaultValue={selectedLeague?.name}
          />
          <Select
            id="leagueUpdateSport"
            options={sports}
            labelText={langParsed.strSport}
          />
          <Select
            id="leagueUpdateCountry"
            options={countries}
            labelText={langParsed.strCountry}
          />
        </Form>
      </FormContainer>
    </Background>
  );
}
