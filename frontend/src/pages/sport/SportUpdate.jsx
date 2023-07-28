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

export default function SportUpdate() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [selectedSport, setSelectedSport] = useState();

  useEffect(() => {
    if (id === "") {
      navigate("/sport");
    }
    getSportByIdAsync();
  }, []);

  async function getSportByIdAsync() {
    try {
      await API.get(`/sport/${id}`, {
        headers: getHeaders(),
      }).then((response) => {
        setSelectedSport(response.data);
      });
    } catch (e) {
      console.log(e);
    }
  }

  async function updateSportAsync(e) {
    e.preventDefault();

    const sportName = e.target.elements.sportUpdateName.value;
    const sportToUpdate = {
      name: sportName,
    };

    try {
      await API.put(`/sport/${id}`, sportToUpdate, {
        headers: getHeaders(),
      }).then(() => {
        toast.success("Sport azuriran");
        navigate("/sport");
      });
    } catch (e) {
      toast.error("Sport nije azuriran");
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
            id="sportUpdateName"
            type="text"
            labelText="Name"
            defaultValue={selectedSport?.name}
          />,
        ]}
        handleOnSubmit={updateSportAsync}
        className="width-400"
      />
    </div>
  );
}
