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
import Select from "../../components/Select";

export default function LocationUpdate() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [selectedLocation, setSelectedLocation] = useState();
  const [countrys, setCountrys] = useState([]);

  useEffect(() => {
    if (id === "") {
      navigate("/location");
    }
    getLocationByIdAsync();
  }, []);
  useEffect(() => {
    fetchCountrysAsync();
  }, []);

  async function getLocationByIdAsync() {
    try {
      await API.get(`/location/${id}`, {
        headers: getHeaders(),
      }).then((response) => {
        setSelectedLocation(response.data);
      });
    } catch (e) {
      console.log(e);
    }
  }
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
  console.log(selectedLocation);
  async function updateLocationAsync(e) {
    e.preventDefault();

    const locationName = e.target.elements.locationUpdateName.value;
    const locationAddress = e.target.elements.locationUpdateAddress.value;
    const locationCountry = e.target.elements.locationUpdateCountry.value;
    const locationToUpdate = {
      name: locationName,
      address: locationAddress,
      countryId: locationCountry,
    };

    try {
      await API.put(`/location/${id}`, locationToUpdate, {
        headers: getHeaders(),
      }).then(() => {
        toast.success("Lokacija azurirana");
        navigate("/location");
      });
    } catch (e) {
      toast.error("Lokacija nije azurirana");
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
            id="locationUpdateName"
            type="text"
            labelText="Ime"
            defaultValue={selectedLocation?.name}
          />,
          <Input
            key={uuid()}
            id="locationUpdateAddress"
            type="text"
            labelText="Adresa"
            defaultValue={selectedLocation?.address}
          />,
          <Select
            key={uuid()}
            id="locationUpdateCountry"
            options={countrys}
            labelText="Država"
          />,
        ]}
        handleOnSubmit={updateLocationAsync}
        className="width-400"
      />
    </div>
  );
}
