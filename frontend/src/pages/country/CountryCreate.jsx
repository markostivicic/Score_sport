import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Form from "../../components/Form";
import Input from "../../components/Input";
import API from "../../services/AxiosService";
import { toast } from "react-toastify";
import { v4 as uuid } from "uuid";
import { getHeaders } from "../../services/AuthService";

export default function CountryCreate() {
  const navigate = useNavigate();

  async function createCountryAsync(e) {
    e.preventDefault();

    const countryName = e.target.elements.countryCreateName.value;
    const countryToUpdate = {
      name: countryName,
    };

    try {
      await API.post(`/country`, countryToUpdate, {
        headers: getHeaders(),
      }).then(() => {
        toast.success("Država kreirana");
        navigate("/country");
      });
    } catch (e) {
      toast.error("Država nije kreirana");
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
            id="countryCreateName"
            type="text"
            labelText="Name"
          />,
        ]}
        handleOnSubmit={createCountryAsync}
        className="width-400"
      />
    </div>
  );
}
