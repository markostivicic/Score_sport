import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Form from "../../components/Form";
import Input from "../../components/Input";
import API from "../../services/AxiosService";
import { toast } from "react-toastify";
import { v4 as uuid } from "uuid";
import { getHeaders } from "../../services/AuthService";
import Select from "../../components/Select";

export default function LeagueUpdate() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [selectedLeague, setSelectedLeague] = useState();
  const [countrys, setCountrys] = useState([]);
  const [sports, setSports] = useState([]);

  useEffect(() => {
    if (id === "") {
      navigate("/league");
    }
    getLeagueByIdAsync();
  }, []);
  useEffect(() => {
    fetchCountrysAsync();
    fetchSportsAsync();
  }, []);

  async function getLeagueByIdAsync() {
    try {
      await API.get(`/league/${id}`, {
        headers: getHeaders(),
      }).then((response) => {
        setSelectedLeague(response.data);
      });
    } catch (e) {
      console.log(e);
    }
  }
  async function fetchCountrysAsync() {
    try {
      await API.get(`/country`, {
        headers: getHeaders(),
      }).then((response) => {
        setCountrys(response.data.items);
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
        setSports(response.data.items);
      });
    } catch (e) {
      console.log(e);
    }
  }
  console.log(selectedLeague);
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

    try {
      await API.put(`/league/${id}`, leagueToUpdate, {
        headers: getHeaders(),
      }).then(() => {
        toast.success("Lokacija azurirana");
        navigate("/league");
      });
    } catch (e) {
      toast.error("Lokacija nije azurirana");
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
            id="leagueUpdateName"
            type="text"
            labelText="Ime"
            defaultValue={selectedLeague?.name}
          />,
          <Select
            key={uuid()}
            id="leagueUpdateSport"
            options={sports}
            labelText="Sport"
          />,
          <Select
            key={uuid()}
            id="leagueUpdateCountry"
            options={countrys}
            labelText="Država"
          />,
        ]}
        handleOnSubmit={updateLeagueAsync}
        className="width-400"
      />
    </div>
  );
}
