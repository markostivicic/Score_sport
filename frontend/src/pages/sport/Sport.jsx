import React, { useEffect, useState } from "react";
import Table from "../../components/Table";
import Navbar from "../../components/Navbar";
import Pagination from "../../components/Pagination";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import {
  getSportsAsync,
  deleteSportByIdAsync,
} from "../../services/SportService";
import Button from "../../components/Button";
import Background from "../../components/Background";
import Modal from "../../components/Modal";
import { v4 as uuid } from "uuid";
import { toast } from "react-toastify";
import { getHeaders } from "../../services/AuthService";
import Button from "../../components/Button";

export default function Sport() {
  const navigate = useNavigate();
  const [sports, setSports] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [selectedSport, setSelectedSport] = useState(null);

  const pageLength = 3;

  useEffect(() => {
    fetchSportsAsync();
  }, [pageNumber]);

  const handleConfirmDelete = () => {
    deleteSportAsync(selectedSport.id);
    setSelectedSport(null);
  };

  const handleCancelDelete = () => {
    setSelectedSport(null);
  };

  async function fetchSportsAsync() {
    const { items, totalCount } = await getSportsAsync(
      navigate,
      pageLength,
      pageNumber
    );
    setSports(items);
    setPageCount(Math.ceil(totalCount / pageLength));
  }

  async function deleteSportAsync(id) {
    await deleteSportByIdAsync(id, navigate);
    fetchSportsAsync();
  }

  function renderData() {
    return sports.map((sport) => {
      return (
        <tr key={sport.id}>
          <td>{sport.name}</td>
          <td>
            <FontAwesomeIcon
              className="cursor-pointer"
              onClick={() => navigate(`/sport/update/${sport.id}`)}
              icon={faPenToSquare}
            />
          </td>
          <td>
            <FontAwesomeIcon
              className="cursor-pointer"
              onClick={() => {
                setSelectedSport(sport);
              }}
              icon={faTrash}
            />
          </td>
        </tr>
      );
    });
  }

  const changePage = ({ selected }) => {
    setPageNumber(selected + 1);
  };

  return (
    <Background>
      <Navbar />
      <Table tableHeaders={["Name"]} renderData={renderData}>
        <Modal
          selectedItem={selectedSport}
          handleCancelDelete={handleCancelDelete}
          handleConfirmDelete={handleConfirmDelete}
        />
      </Table>
      <Button
        text="Dodaj"
        handleOnClick={() => navigate("/sport/create")}
        margin="my-3"
      />
      <Pagination pageCount={pageCount} changePage={changePage} />
    </Background>
  );
}
