import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Form from "../../components/Form";
import Input from "../../components/Input";
import Background from "../../components/Background";
import FormContainer from "../../components/FormContainer";
import {
  getCountryByIdAsync,
  updateCountryByIdAsync,
} from "../../services/CountryService";
import { useResultContext } from "../../context/ResultContext";

export default function CountryUpdate() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [selectedCountry, setSelectedCountry] = useState();
  const { lang } = useResultContext();

  const langParsed = JSON.parse(lang);

  useEffect(() => {
    if (id === "") {
      navigate("/country");
    }
    getCountryAsync();
  }, []);

  async function getCountryAsync() {
    const data = await getCountryByIdAsync(id, navigate);
    setSelectedCountry(data);
  }

  async function updateCountryAsync(e) {
    e.preventDefault();

    const countryName = e.target.elements.countryUpdateName.value;
    const countryToUpdate = {
      name: countryName,
    };

    await updateCountryByIdAsync(id, countryToUpdate);
    navigate("/country");
  }

  return (
    <Background>
      <Navbar />
      <FormContainer>
        <Form handleOnSubmit={updateCountryAsync}>
          <Input
            id="countryUpdateName"
            type="text"
            labelText={langParsed.strName}
            defaultValue={selectedCountry?.name}
          />
        </Form>
      </FormContainer>
    </Background>
  );
}
