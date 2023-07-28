import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Form from "../../components/Form";
import Input from "../../components/Input";
import API from "../../services/AxiosService";
import { toast } from "react-toastify";
import { v4 as uuid } from "uuid";
import { getHeaders } from "../../services/AuthService";

export default function SportCreate() {
  const navigate = useNavigate();

  async function createSportAsync(e) {
    e.preventDefault();

    const sportName = e.target.elements.sportCreateName.value;
    const sportToUpdate = {
      name: sportName,
    };

    try {
      await API.post(`/sport`, sportToUpdate, {
        headers: getHeaders(),
      }).then(() => {
        toast.success("Sport kreiran");
        navigate("/sport");
      });
    } catch (e) {
      toast.error("Sport nije kreiran");
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
            id="sportCreateName"
            type="text"
            labelText="Name"
          />,
        ]}
        handleOnSubmit={createSportAsync}
        className="width-400"
      />
    </div>
  );
}
