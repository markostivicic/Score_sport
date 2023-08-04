import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Form from "../../components/Form";
import Input from "../../components/Input";
import { createNewLocationAsync } from "../../services/LocationService";
import FormContainer from "../../components/FormContainer";
import Background from "../../components/Background";
import Select from "../../components/Select";
import { getCountriesAsync } from "../../services/CountryService";
import { useResultContext } from "../../context/ResultContext";

export default function LocationCreate() {
  const navigate = useNavigate();
  const [countries, setCountries] = useState([]);
  const { lang } = useResultContext();

  const langParsed = JSON.parse(lang);

  async function createLocationAsync(e) {
    e.preventDefault();
    const locationName = e.target.elements.locationCreateName.value;
    const locationAddress = e.target.elements.locationCreateAddress.value;
    const locationCountry = e.target.elements.locationCreateCountry.value;
    const locationToCreate = {
      name: locationName,
      address: locationAddress,
      countryId: locationCountry,
    };

    await createNewLocationAsync(locationToCreate, navigate);
    navigate("/location");
  }

  useEffect(() => {
    async function fetchCountriesAsync() {
      const { items } = await getCountriesAsync(navigate, 100, 0);
      setCountries(items);
    }
    fetchCountriesAsync();
  }, []);

  return (
    <Background>
      <Navbar />
      <FormContainer>
        <Form handleOnSubmit={createLocationAsync}>
          <Input
            id="locationCreateName"
            type="text"
            labelText={langParsed.strName}
          />
          <Input
            id="locationCreateAddress"
            type="text"
            labelText={langParsed.strAddress}
          />
          <Select
            id="locationCreateCountry"
            options={countries}
            labelText={langParsed.strCountry}
          />
        </Form>
      </FormContainer>
    </Background>
  );
}
