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

export default function CountryUpdate() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [selectedCountry, setSelectedCountry] = useState();

  useEffect(() => {
    if (id === "") {
      navigate("/country");
    }
    getCountryByIdAsync();
  }, []);

  async function getCountryByIdAsync() {
    try {
      await API.get(`/country/${id}`, {
        headers: getHeaders(),
      }).then((response) => {
        setSelectedCountry(response.data);
      });
    } catch (e) {
      console.log(e);
    }
  }

  async function updateCountryAsync(e) {
    e.preventDefault();

    const countryName = e.target.elements.countryUpdateName.value;
    const countryToUpdate = {
      name: countryName,
    };

    try {
      await API.put(`/country/${id}`, countryToUpdate, {
        headers: getHeaders(),
      }).then(() => {
        toast.success("Država azurirana");
        navigate("/country");
      });
    } catch (e) {
      toast.error("Država nije azurirana");
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
            id="countryUpdateName"
            type="text"
            labelText="Name"
            defaultValue={selectedCountry?.name}
          />,
        ]}
        handleOnSubmit={updateCountryAsync}
        className="width-400"
      />
    </div>
  );
}
