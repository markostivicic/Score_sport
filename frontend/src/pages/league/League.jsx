import React, { useEffect, useState } from "react";
import Table from "../../components/Table";
import Navbar from "../../components/Navbar";
import Pagination from "../../components/Pagination";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import Button from "../../components/Button";
import {
  getLeaguesAsync,
  deleteLeagueByIdAsync,
} from "../../services/LeagueService";
import Background from "../../components/Background";
import Modal from "../../components/Modal";

export default function League() {
  const navigate = useNavigate();
  const [leagues, setLeagues] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [selectedLeague, setSelectedLeague] = useState(null);

  const pageLength = 3;

  useEffect(() => {
    fetchLeaguesAsync();
  }, [pageNumber]);

  const handleConfirmDelete = () => {
    deleteLeagueAsync(selectedLeague.id);
    setSelectedLeague(null);
  };

  const handleCancelDelete = () => {
    setSelectedLeague(null);
  };

  async function fetchLeaguesAsync() {
    const { items, totalCount } = await getLeaguesAsync(
      navigate,
      pageLength,
      pageNumber
    );
    setLeagues(items);
    setPageCount(Math.ceil(totalCount / pageLength));
  }

  async function deleteLeagueAsync(id) {
    await deleteLeagueByIdAsync(id, navigate);
    fetchLeaguesAsync();
  }

  function renderData() {
    return leagues.map((league) => {
      return (
        <tr key={league.id}>
          <td>{league.name}</td>
          <td>{league.sport.name}</td>
          <td>{league.country.name}</td>
          <td>
            <FontAwesomeIcon
              className="cursor-pointer"
              onClick={() => navigate(`/league/update/${league.id}`)}
              icon={faPenToSquare}
            />
          </td>
          <td>
            <FontAwesomeIcon
              className="cursor-pointer"
              onClick={() => {
                setSelectedLeague(league);
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
      <Table tableHeaders={["Ime", "Sport", "Država"]} renderData={renderData}>
        <Modal
          selectedItem={selectedLeague}
          handleCancelDelete={handleCancelDelete}
          handleConfirmDelete={handleConfirmDelete}
        />
      </Table>
      <Button
        text="Dodaj"
        handleOnClick={() => navigate("/league/create")}
        margin="my-3"
      />
      <Pagination pageCount={pageCount} changePage={changePage} />
    </Background>
  );
}
