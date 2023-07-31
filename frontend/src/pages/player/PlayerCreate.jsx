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
    const playerToUpdate = {
      firstName: playerFirstName,
      lastName: playerLastName,
      image: playerImage,
      doB: playerDoB,
      clubId: playerClub,
      countryId: playerCountry,
    };

    try {
      await API.post(`/player`, playerToUpdate, {
        headers: getHeaders(),
      }).then(() => {
        toast.success("Igrač kreiran");
        navigate("/player");
      });
    } catch (e) {
      toast.error("Igrač nije kreiran");
      console.log(e);
    }
  }

  async function fetchClubsAsync() {
    try {
      await API.get(`/club`, {
        headers: getHeaders(),
      }).then((response) => {
        const clubsFromDatabase = response.data.items;
        setClubs(clubsFromDatabase);
        setSelectedClub(
          clubsFromDatabase.length > 0
            ? clubsFromDatabase[0].id
            : navigate("/player")
        );
      });
    } catch (e) {
      console.log(e);
    }
  }
  async function fetchCountriesAsync() {
    try {
      await API.get(`/country`, {
        headers: getHeaders(),
      }).then((response) => {
        const countriesFromDatabase = response.data.items;
        setCountry(countriesFromDatabase);
        setSelectedCountry(
          countriesFromDatabase.length > 0
            ? countriesFromDatabase[0].id
            : navigate("/player")
        );
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
            id="playerCreateFirstName"
            type="text"
            labelText="Ime"
          />,
          <Input
            key={uuid()}
            id="playerCreateLastName"
            type="text"
            labelText="Prezime"
          />,
          <Input
            key={uuid()}
            id="playerCreateImage"
            type="url"
            labelText="Slika"
          />,
          <Input
            key={uuid()}
            id="playerCreateDoB"
            type="date"
            labelText="Datum rođenja"
          />,
          <Select
            key={uuid()}
            id="playerCreateClub"
            options={clubs}
            value={selectedClub}
            onChange={(e) => setSelectedClub(e.target.value)}
            labelText="Klub"
          />,
          <Select
            key={uuid()}
            id="playerCreateCountry"
            options={countries}
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            labelText="Nacionalnost"
          />,
        ]}
        handleOnSubmit={createPlayerAsync}
        className="width-400"
      />
    </div>
  );
}
