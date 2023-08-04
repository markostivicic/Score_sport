import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Form from "../../components/Form";
import Input from "../../components/Input";
import Select from "../../components/Select";
import { getClubsAsync } from "../../services/ClubService";
import { getCountriesAsync } from "../../services/CountryService";
import {
  getPlayerByIdAsync,
  updatePlayerByIdAsync,
} from "../../services/PlayerService";
import Background from "../../components/Background";
import FormContainer from "../../components/FormContainer";
import { useResultContext } from "../../context/ResultContext";

export default function ClubUpdate() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [selectedPlayer, setSelectedPlayer] = useState();
  const [clubs, setClubs] = useState([]);
  const [selectedClub, setSelectedClub] = useState("");
  const [countries, setCountry] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState({});
  const { lang } = useResultContext();

  const langParsed = JSON.parse(lang);

  useEffect(() => {
    if (id === "") {
      navigate("/player");
    }
    getPlayerAsync();
  }, []);

  useEffect(() => {
    fetchClubsAsync();
    fetchCountriesAsync();
  }, []);

  async function getPlayerAsync() {
    const items = await getPlayerByIdAsync(id, navigate);
    setSelectedPlayer(items);
    setSelectedClub(items.clubId);
    setSelectedCountry(items.countryId);
  }

  async function fetchClubsAsync() {
    const { items } = await getClubsAsync(id, navigate);
    setClubs(items);
  }

  async function fetchCountriesAsync() {
    const { items } = await getCountriesAsync(id, navigate);
    setCountry(items);
  }

  async function updatePlayerAsync(e) {
    e.preventDefault();

    const playerFirstName = e.target.elements.playerCreateFirstName.value;
    const playerLastName = e.target.elements.playerCreateLastName.value;
    const playerImage = e.target.elements.playerCreateImage.value;
    const playerDoB = e.target.elements.playerCreateDoB.value;
    const playerClub = e.target.elements.playerCreateClub.value;
    const playerCountry = e.target.elements.playerCreateCountry.value;
    const playerToUpdate = {
      firstName: playerFirstName,
      lastName: playerLastName,
      image: playerImage,
      doB: playerDoB,
      clubId: playerClub,
      countryId: playerCountry,
    };

    await updatePlayerByIdAsync(id, playerToUpdate, navigate);
    navigate("/player");
  }

  return (
    <Background>
      <Navbar />
      <FormContainer>
        <Form handleOnSubmit={updatePlayerAsync}>
          <Input
            id="playerCreateFirstName"
            type="text"
            labelText={langParsed.strFirstName}
            defaultValue={selectedPlayer?.firstName}
          />
          <Input
            id="playerCreateLastName"
            type="text"
            labelText={langParsed.strLastName}
            defaultValue={selectedPlayer?.lastName}
          />
          <Input
            id="playerCreateImage"
            type="url"
            labelText={langParsed.strImage}
            defaultValue={selectedPlayer?.image}
          />
          <Input
            id="playerCreateDoB"
            type="datetime-local"
            labelText={langParsed.strBirthDate}
            defaultValue={selectedPlayer?.doB}
          />
          <Select
            id="playerCreateClub"
            options={clubs}
            value={selectedClub}
            onChange={(e) => setSelectedClub(e.target.value)}
            labelText={langParsed.strClub}
          />
          <Select
            id="playerCreateCountry"
            options={countries}
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            labelText={langParsed.strNationality}
          />
        </Form>
      </FormContainer>
    </Background>
  );
}
