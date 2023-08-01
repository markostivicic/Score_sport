import React, { useEffect, useState } from "react";
import Table from "../../components/Table";
import Navbar from "../../components/Navbar";
import Pagination from "../../components/Pagination";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { v4 as uuid } from "uuid";
import { getClubsAsync, deleteClubByIdAsync } from "../../services/ClubService";
import Button from "../../components/Button";
import Background from "../../components/Background";
import Modal from "../../components/Modal";

export default function Club() {
  const navigate = useNavigate();
  const [clubs, setClubs] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [selectedClub, setSelectedClub] = useState(null);

  const pageLength = 3;

  useEffect(() => {
    fetchClubsAsync();
  }, [pageNumber]);

  async function fetchClubsAsync() {
    const { items, totalCount } = await getClubsAsync(
      navigate,
      pageLength,
      pageNumber
    );
    setClubs(items);
    setPageCount(Math.ceil(totalCount / pageLength));
  }
  const handleConfirmDelete = () => {
    deleteClubAsync(selectedClub.id);
    setSelectedClub(null);
  };

  const handleCancelDelete = () => {
    setSelectedClub(null);
  };

  async function deleteClubAsync(id) {
    await deleteClubByIdAsync(id, navigate);
    fetchClubsAsync();
  }

  function renderData() {
    return clubs.map((club) => {
      return (
        <tr key={uuid()}>
          <td>{club.name}</td>
          <td>
            <img src={club.logo} className="clublogo" alt="logo" />
          </td>
          <td>{club.league.name}</td>
          <td>{club.location.name}</td>
          <td>
            <FontAwesomeIcon
              className="cursor-pointer"
              onClick={() => navigate(`/club/update/${club.id}`)}
              icon={faPenToSquare}
            />
          </td>
          <td>
            <FontAwesomeIcon
              className="cursor-pointer"
              onClick={() => {
                setSelectedClub(club);
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
      <Table
        tableHeaders={["Ime", "Logo", "Liga", "Lokacija"]}
        renderData={renderData}
      >
        <Modal
          selectedItem={selectedClub}
          handleCancelDelete={handleCancelDelete}
          handleConfirmDelete={handleConfirmDelete}
        />
      </Table>
      <Button
        text="Dodaj"
        handleOnClick={() => navigate("/club/create")}
        margin="my-3"
      />
      <Pagination pageCount={pageCount} changePage={changePage} />
    </Background>
  );
}
