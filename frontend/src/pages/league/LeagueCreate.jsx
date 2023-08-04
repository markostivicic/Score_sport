import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Form from "../../components/Form";
import Input from "../../components/Input";
import { createNewLeagueAsync } from "../../services/LeagueService";
import FormContainer from "../../components/FormContainer";
import Background from "../../components/Background";
import Select from "../../components/Select";
import { getCountriesAsync } from "../../services/CountryService";
import { getSportsAsync } from "../../services/SportService";
import { useResultContext } from "../../context/ResultContext";

export default function LeagueCreate() {
  const navigate = useNavigate();
  const [countries, setCountries] = useState([]);
  const [sports, setSports] = useState([]);
  const { lang } = useResultContext();

  const langParsed = JSON.parse(lang);

  async function createLeagueAsync(e) {
    e.preventDefault();
    const leagueName = e.target.elements.leagueCreateName.value;
    const leagueSport = e.target.elements.leagueCreateSport.value;
    const leagueCountry = e.target.elements.leagueCreateCountry.value;
    const leagueToCreate = {
      name: leagueName,
      sportId: leagueSport,
      countryId: leagueCountry,
    };

    await createNewLeagueAsync(leagueToCreate, navigate);
    navigate("/league");
  }

  useEffect(() => {
    fetchSportsAsync();
    fetchCountriesAsync();
  }, []);

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
        <Form handleOnSubmit={createLeagueAsync}>
          <Input
            id="leagueCreateName"
            type="text"
            labelText={langParsed.strName}
          />
          <Select
            id="leagueCreateSport"
            options={sports}
            labelText={langParsed.strSport}
          />
          <Select
            id="leagueCreateCountry"
            options={countries}
            labelText={langParsed.strCountry}
          />
        </Form>
      </FormContainer>
    </Background>
  );
}
