import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Form from "../../components/Form";
import Input from "../../components/Input";
import Select from "../../components/Select";
import API from "../../services/AxiosService";
import { toast } from "react-toastify";
import { v4 as uuid } from "uuid";
import { getHeaders } from "../../services/AuthService";

export default function LeagueCreate() {
  const navigate = useNavigate();
  const [countrys, setCountrys] = useState([]);
  const [sports, setSports] = useState([]);
  useEffect(() => {
    fetchCountrysAsync();
    fetchSportsAsync();
  }, []);
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

  async function createLeagueAsync(e) {
    e.preventDefault();

    const leagueName = e.target.elements.leagueCreateName.value;
    const leagueSport = e.target.elements.leagueCreateSport.value;
    const leagueCountry = e.target.elements.leagueCreateCountry.value;
    const leagueToUpdate = {
      name: leagueName,
      sportId: leagueSport,
      countryId: leagueCountry,
    };

    try {
      await API.post(`/league`, leagueToUpdate, {
        headers: getHeaders(),
      }).then(() => {
        toast.success("Liga kreirana");
        navigate("/league");
      });
    } catch (e) {
      toast.error("Liga nije kreirana");
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
            id="leagueCreateName"
            type="text"
            labelText="ime"
          />,
          <Select
            key={uuid()}
            id="leagueCreateSport"
            options={sports}
            labelText="Sport"
          />,
          <Select
            key={uuid()}
            id="leagueCreateCountry"
            options={countrys}
            labelText="Država"
          />,
        ]}
        handleOnSubmit={createLeagueAsync}
        className="width-400"
      />
    </div>
  );
}
