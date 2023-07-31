import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Form from "../../components/Form";
import Input from "../../components/Input";
import { createNewCountryAsync } from "../../services/CountryService";
import FormContainer from "../../components/FormContainer";
import Background from "../../components/Background";

export default function CountryCreate() {
  const navigate = useNavigate();

  async function createCountryAsync(e) {
    e.preventDefault();
    const countryName = e.target.elements.countryCreateName.value;
    const countryToCreate = {
      name: countryName,
    };

    await createNewCountryAsync(countryToCreate, navigate);
    navigate("/country");
  }

  return (
    <Background>
      <Navbar />
      <FormContainer>
        <Form handleOnSubmit={createCountryAsync}>
          <Input id="countryCreateName" type="text" labelText="Name" />
        </Form>
      </FormContainer>
    </Background>
  );
}
