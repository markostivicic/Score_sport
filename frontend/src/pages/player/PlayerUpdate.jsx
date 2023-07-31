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
  const [selectedPlayer, setSelectedPlayer] = useState();
  const [clubs, setClubs] = useState([]);
  const [selectedClub, setSelectedClub] = useState("");
  const [countries, setCountry] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState({});

  useEffect(() => {
    if (id === "") {
      navigate("/player");
    }
    getPlayerByIdAsync();
  }, []);

  useEffect(() => {
    fetchClubsAsync();
    fetchCountriesAsync();
  }, []);

  async function getPlayerByIdAsync() {
    try {
      await API.get(`/player/${id}`, {
        headers: getHeaders(),
      }).then((response) => {
        setSelectedPlayer(response.data);
      });
    } catch (e) {
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

    try {
      await API.put(`/player/${id}`, playerToUpdate, {
        headers: getHeaders(),
      }).then(() => {
        toast.success("Igrač ažuriran");
        navigate("/player");
      });
    } catch (e) {
      toast.error("Igrač nije ažuriran");
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
            defaultValue={selectedPlayer?.firstName}
          />,
          <Input
            key={uuid()}
            id="playerCreateLastName"
            type="text"
            labelText="Prezime"
            defaultValue={selectedPlayer?.lastName}
          />,
          <Input
            key={uuid()}
            id="playerCreateImage"
            type="url"
            labelText="Slika"
            defaultValue={selectedPlayer?.image}
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
        handleOnSubmit={updatePlayerAsync}
        className="width-400"
      />
    </div>
  );
}
