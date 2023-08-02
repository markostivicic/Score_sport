import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Form from "../../components/Form";
import Input from "../../components/Input";
import Background from "../../components/Background";
import FormContainer from "../../components/FormContainer";
import {
  getSportByIdAsync,
  updateSportByIdAsync,
} from "../../services/SportService";
import { useResultContext } from "../../context/ResultContext";

export default function SportUpdate() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [selectedSport, setSelectedSport] = useState();
  const { lang } = useResultContext();

  const langParsed = JSON.parse(lang);

  useEffect(() => {
    if (id === "") {
      navigate("/sport");
    }
    getSportAsync();
  }, []);

  async function getSportAsync() {
    const data = await getSportByIdAsync(id, navigate);
    setSelectedSport(data);
  }

  async function updateSportAsync(e) {
    e.preventDefault();

    const sportName = e.target.elements.sportUpdateName.value;
    const sportToUpdate = {
      name: sportName,
    };

    await updateSportByIdAsync(id, sportToUpdate);
    navigate("/sport");
  }

  return (
    <Background>
      <Navbar />
      <FormContainer>
        <Form handleOnSubmit={updateSportAsync}>
          <Input
            id="sportUpdateName"
            type="text"
            labelText={langParsed.strName}
            defaultValue={selectedSport?.name}
          />
        </Form>
      </FormContainer>
    </Background>
  );
}
