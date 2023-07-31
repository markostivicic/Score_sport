import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Form from "../../components/Form";
import Input from "../../components/Input";
import { createNewSportAsync } from "../../services/SportService";
import FormContainer from "../../components/FormContainer";
import Background from "../../components/Background";

export default function SportCreate() {
  const navigate = useNavigate();

  async function createSportAsync(e) {
    e.preventDefault();
    const sportName = e.target.elements.sportCreateName.value;
    const sportToCreate = {
      name: sportName,
    };

    await createNewSportAsync(sportToCreate, navigate);
    navigate("/sport");
  }

  return (
    <Background>
      <Navbar />
      <FormContainer>
        <Form handleOnSubmit={createSportAsync}>
          <Input id="sportCreateName" type="text" labelText="Name" />
        </Form>
      </FormContainer>
    </Background>
  );
}
