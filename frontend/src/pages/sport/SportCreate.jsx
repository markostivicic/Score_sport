import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Form from "../../components/Form";
import Input from "../../components/Input";
import API from "../../services/AxiosService";
import { toast } from "react-toastify";
import { v4 as uuid } from "uuid";

export default function SportCreate() {
  const navigate = useNavigate();

  const token =
    "8mTvr1VPxmamgrHenYNXw_rJg-qJBFe-H71w2lZlbfn_ETZaBoL5o296rsvfSoGgJdgWAXkkHE-DixpQ7HcIT0Kc_iVTLdzYxTln-cELuo8YI_oIVYV7S-rr6c8zZvKBx0q1oKUz1v7_phQ6voMK8sp7DnLOHG2qpzYepbo6wM8bL3UvYLHhMdaKaAtkqMNQjZ_YMCbppDjxFSMaPZq8QgbEwoCszssw2HiZtQxs33NYz0k4orTj8X36uD5LS1YKEPImZ3sxbqL1PncAIGWmW7tcQsuUFSCk7POI9v0tAdKN7CpmjfaYtZsB67DnqbHg5XcBhoD8kYZ3q_PyoKuNt8ioYFCXNoP4ysfnjlNiFiHQcov8REIlWAIg97LD7gjM3GUmB_O9A5BV1ZUp17Q1Z5Pd-RroInuCmCb-etTPlkrRNnkPNxbZ7g0wgOGcMwcQ_yD6tAdCAIJ_9dcEgzkM8PzNyiMn8wXzIwcXwVF74bRD_CwJg49cylgRX9k4g9bxDkNFGreoi2Ld7Sfj5avZBg";

  async function createSportAsync(e) {
    e.preventDefault();

    const sportName = e.target.elements.sportCreateName.value;
    const sportToUpdate = {
      name: sportName,
    };

    try {
      await API.post(`/sport`, sportToUpdate, {
        headers: {
          Authorization: "Bearer " + token,
        },
      }).then(() => {
        toast.success("Sport created");
        navigate("/sport");
      });
    } catch (e) {
      toast.error("Sport not created");
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
