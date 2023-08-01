import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Form from "../../components/Form";
import Input from "../../components/Input";
import Select from "../../components/Select";
import Background from "../../components/Background";
import FormContainer from "../../components/FormContainer";
import { getCountrysAsync } from "../../services/CountryService";
import { getClubsAsync } from "../../services/ClubService";
import { createNewPlayerAsync } from "../../services/PlayerService";

export default function ClubCreate() {
  const navigate = useNavigate();
  const [clubs, setClubs] = useState([]);
  const [selectedClub, setSelectedClub] = useState("");
  const [countries, setCountry] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState({});

  useEffect(() => {
    fetchClubsAsync();
    fetchCountriesAsync();
  }, []);

  async function createPlayerAsync(e) {
    e.preventDefault();

    const playerFirstName = e.target.elements.playerCreateFirstName.value;
    const playerLastName = e.target.elements.playerCreateLastName.value;
    const playerImage = e.target.elements.playerCreateImage.value;
    const playerDoB = e.target.elements.playerCreateDoB.value;
    const playerClub = e.target.elements.playerCreateClub.value;
    const playerCountry = e.target.elements.playerCreateCountry.value;
    const playerToCreate = {
      firstName: playerFirstName,
      lastName: playerLastName,
      image: playerImage,
      doB: playerDoB,
      clubId: playerClub,
      countryId: playerCountry,
    };

    await createNewPlayerAsync(playerToCreate, navigate);
    navigate("/player");
  }

  async function fetchClubsAsync() {
    const { items } = await getClubsAsync(navigate, 100, 0);
    setClubs(items);
  }
  async function fetchCountriesAsync() {
    const { items } = await getCountrysAsync(navigate, 100, 0);
    setCountry(items);
  }

  return (
    <Background>
      <FormContainer>
        <Form handleOnSubmit={createPlayerAsync}>
          <Input id="playerCreateFirstName" type="text" labelText="Ime" />
          <Input id="playerCreateLastName" type="text" labelText="Prezime" />
          <Input id="playerCreateImage" type="url" labelText="Slika" />
          <Input id="playerCreateDoB" type="date" labelText="Datum rođenja" />
          <Select
            id="playerCreateClub"
            options={clubs}
            value={selectedClub}
            onChange={(e) => setSelectedClub(e.target.value)}
            labelText="Klub"
          />
          <Select
            id="playerCreateCountry"
            options={countries}
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            labelText="Nacionalnost"
          />
        </Form>
      </FormContainer>
    </Background>
  );
}
