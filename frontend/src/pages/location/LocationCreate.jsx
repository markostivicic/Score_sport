import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Form from "../../components/Form";
import Input from "../../components/Input";
import Select from "../../components/Select";
import API from "../../services/AxiosService";
import { toast } from "react-toastify";
import { v4 as uuid } from "uuid";
import { getHeaders } from "../../services/AuthService";

export default function LocationCreate() {
  const navigate = useNavigate();
  const [countrys, setCountrys] = useState([]);
  useEffect(() => {
    fetchCountrysAsync();
  }, []);
  async function fetchCountrysAsync() {
    try {
      await API.get(`/country`, {
        headers: getHeaders(),
      }).then((response) => {
        setCountrys(response.data.items);
      });
    } catch (e) {
      console.log(e);
    }
  }

  async function createLocationAsync(e) {
    e.preventDefault();

    const locationName = e.target.elements.locationCreateName.value;
    const locationAddress = e.target.elements.locationCreateAddress.value;
    const locationCountry = e.target.elements.locationCreateCountry.value;
    const locationToUpdate = {
      name: locationName,
      address: locationAddress,
      countryId: locationCountry,
    };

    try {
      await API.post(`/location`, locationToUpdate, {
        headers: getHeaders(),
      }).then(() => {
        toast.success("Država kreirana");
        navigate("/location");
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
            id="locationCreateName"
            type="text"
            labelText="ime"
          />,
          <Input
            key={uuid()}
            id="locationCreateAddress"
            type="text"
            labelText="Adresa"
          />,
          <Select
            key={uuid()}
            id="locationCreateCountry"
            options={countrys}
            labelText="Država"
          />,
        ]}
        handleOnSubmit={createLocationAsync}
        className="width-400"
      />
    </div>
  );
}
