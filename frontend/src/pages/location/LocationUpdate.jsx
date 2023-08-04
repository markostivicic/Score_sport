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
  getLocationByIdAsync,
  updateLocationByIdAsync,
} from "../../services/LocationService";
import { getCountriesAsync } from "../../services/CountryService";
import { useResultContext } from "../../context/ResultContext";

export default function LocationUpdate() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [selectedLocation, setSelectedLocation] = useState();
  const [countries, setCountries] = useState([]);
  const { lang } = useResultContext();
  const [selectedCountry, setSelectedCountry] = useState("");

  const langParsed = JSON.parse(lang);

  useEffect(() => {
    if (id === "") {
      navigate("/location");
    }
    getLocationAsync();
    fetchCountriesAsync();
  }, []);

  async function getLocationAsync() {
    const data = await getLocationByIdAsync(id, navigate);
    setSelectedLocation(data);
    setSelectedCountry(data.countryId);
  }

  async function updateLocationAsync(e) {
    e.preventDefault();

    const locationName = e.target.elements.locationUpdateName.value;
    const locationAddress = e.target.elements.locationUpdateAddress.value;
    const locationCountry = e.target.elements.locationUpdateCountry.value;
    const locationToUpdate = {
      name: locationName,
      address: locationAddress,
      countryId: locationCountry,
    };

    await updateLocationByIdAsync(id, locationToUpdate);
    navigate("/location");
  }

  async function fetchCountriesAsync() {
    const { items } = await getCountriesAsync(navigate, 100, 0);
    setCountries(items);
  }

  return (
    <Background>
      <Navbar />
      <FormContainer>
        <Form handleOnSubmit={updateLocationAsync}>
          <Input
            id="locationUpdateName"
            type="text"
            labelText={langParsed.strName}
            defaultValue={selectedLocation?.name}
          />
          <Input
            id="locationUpdateAddress"
            type="text"
            labelText={langParsed.strAddress}
            defaultValue={selectedLocation?.address}
          />
          <Select
            id="locationUpdateCountry"
            options={countries}
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            labelText={langParsed.strCountry}
          />
        </Form>
      </FormContainer>
    </Background>
  );
}
