import React, { useEffect, useState } from "react";
import Table from "../../components/Table";
import Navbar from "../../components/Navbar";
import Pagination from "../../components/Pagination";
import API from "../../services/AxiosService";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { v4 as uuid } from "uuid";
import { toast } from "react-toastify";
import { getHeaders } from "../../services/AuthService";
import {
  getPlayersAsync,
  deletePlayerAsync,
  deletePlayerByIdAsync,
} from "../../services/PlayerService";
import Button from "../../components/Button";
import Background from "../../components/Background";
import Modal from "../../components/Modal";

export default function Player() {
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  const pageLength = 3;

  useEffect(() => {
    fetchPlayersAsync();
  }, [pageNumber]);

  async function fetchPlayersAsync() {
    const { items, totalCount } = await getPlayersAsync(
      navigate,
      pageLength,
      pageNumber
    );
    setPlayers(items);
    setPageCount(Math.ceil(totalCount / pageLength));
  }

  const handleConfirmDelete = () => {
    deletePlayerAsync(selectedPlayer.id);
    setSelectedPlayer(null);
  };

  const handleCancelDelete = () => {
    setSelectedPlayer(null);
  };

  async function deletePlayerAsync(id) {
    await deletePlayerByIdAsync(id, navigate);
    fetchPlayersAsync();
  }

  function renderData() {
    return players.map((player) => {
      return (
        <tr key={uuid()}>
          <td>{player.firstName}</td>
          <td>{player.lastName}</td>
          <td>
            <img src={player.image} className="playerlogo" alt="player" />
          </td>
          <td>{player.doB}</td>
          <td>{player.club.name}</td>
          <td>{player.country.name}</td>
          <td>
            <FontAwesomeIcon
              className="cursor-pointer"
              onClick={() => navigate(`/player/update/${player.id}`)}
              icon={faPenToSquare}
            />
          </td>
          <td>
            <FontAwesomeIcon
              className="cursor-pointer"
              onClick={() => {
                setSelectedPlayer(player);
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

  /* return (
    <div>
      <Navbar />
      <Table
        tableHeaders={[
          "Ime",
          "Prezime",
          "Slika",
          "Datum rođenja",
          "Klub",
          "Nacionalnost",
        ]}
        renderData={renderData}
      />
      <Pagination pageCount={pageCount} changePage={changePage} />
    </div>
  ); */

  return (
    <Background>
      <Navbar />
      <Table
        tableHeaders={[
          "Ime",
          "Prezime",
          "Slika",
          "Datum rođenja",
          "Klub",
          "Nacionalnost",
        ]}
        renderData={renderData}
      >
        <Modal
          selectedItem={selectedPlayer}
          handleCancelDelete={handleCancelDelete}
          handleConfirmDelete={handleConfirmDelete}
        />
      </Table>
      <Button
        text="Dodaj"
        handleOnClick={() => navigate("/player/create")}
        margin="my-3"
      />
      <Pagination pageCount={pageCount} changePage={changePage} />
    </Background>
  );
}
