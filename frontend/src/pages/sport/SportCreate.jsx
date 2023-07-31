import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Form from "../../components/Form";
import Input from "../../components/Input";
import { createNewSportAsync } from "../../services/SportService";
import FormContainer from "../../components/FormContainer";
import Background from "../../components/Background";
import API from "../../services/AxiosService";
import { toast } from "react-toastify";
import { v4 as uuid } from "uuid";
import { getHeaders } from "../../services/AuthService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";

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
