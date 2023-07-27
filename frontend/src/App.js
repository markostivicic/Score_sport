import "./App.css";
import { ToastContainer, toast } from "react-toastify";
import { Routes } from "react-router-dom";
import { useResultContext } from "./context/ResultContext";
import Button from "./components/Button";
import Pagination from "./components/Pagination";
import Input from "./components/Input";
import Form from "./components/Form";
import { v4 as uuid } from "uuid";
import Select from "./components/Select";
import Table from "./components/Table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Navbar from "./components/Navbar";

function App() {
  const { loggedIn } = useResultContext();

  const [list, setList] = useState([
    { id: "Id1", name: "name1" },
    { id: "Id2", name: "name2" },
  ]);

  const navigate = useNavigate();

  function renderData() {
    return list.map((listItem) => {
      return (
        <tr key={uuid()}>
          <td>{listItem.id}</td>
          <td>{listItem.name}</td>
          <td>
            <FontAwesomeIcon
              className="cursor-pointer"
              onClick={() => navigate(`/update/nesto/${listItem.id}`)}
              icon={faPenToSquare}
            />
          </td>
          <td>
            <FontAwesomeIcon
              className="cursor-pointer"
              onClick={() => setList([...list, { id: "novi", name: "novi" }])}
              icon={faTrash}
            />
          </td>
        </tr>
      );
    });
  }

  return (
    <>
      <Navbar />
      <Table tableHeaders={["Id", "Name"]} renderData={renderData} />
      <Form
        handleOnSubmit={(e) => {
          e.preventDefault();
          console.log("submit form");
        }}
        className="width-400"
        formElements={[
          <Input key={uuid()} id={"id"} type="date" labelText="test" />,
          <Select
            key={uuid()}
            options={[
              { name: "sdf", id: "sfd" },
              { name: "sf", id: "sf" },
            ]}
            labelText="testselect"
          />,
        ]}
      />
      <Pagination pageCount={10} />
      <Routes></Routes>
      <ToastContainer />
    </>
  );
}

export default App;
