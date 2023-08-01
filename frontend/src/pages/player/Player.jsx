import React, { useEffect, useState } from "react";
import Table from "../../components/Table";
import Navbar from "../../components/Navbar";
import Pagination from "../../components/Pagination";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faTrash,
  faUndoAlt,
} from "@fortawesome/free-solid-svg-icons";
import {
  getPlayersWithFiltersAsync,
  deletePlayerByIdAsync,
} from "../../services/PlayerService";
import Button from "../../components/Button";
import Background from "../../components/Background";
import Modal from "../../components/Modal";
import Filter from "../../components/filters/Filter";
import InputFilter from "../../components/filters/InputFilter";
import SwitchFilter from "../../components/filters/SwitchFilter";
import PageLengthSelect from "../../components/PageLengthSelect";

export default function Player() {
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [pageLength, setPageLength] = useState(5);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [activeFilter, setActiveFilter] = useState(true);
  const [searchFilter, setSearchFilter] = useState("");

  useEffect(() => {
    fetchPlayersAsync();
  }, [pageNumber, pageLength, activeFilter, searchFilter]);

  async function fetchPlayersAsync() {
    const { items, totalCount } = await getPlayersWithFiltersAsync(
      navigate,
      pageLength,
      pageNumber,
      activeFilter,
      searchFilter
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
        <tr key={player.id}>
          <td>{player.firstName}</td>
          <td>{player.lastName}</td>
          <td>
            <img src={player.image} className="playerlogo" alt="player" />
          </td>
          <td>{player.doB}</td>
          <td>{player.club.name}</td>
          <td>{player.country.name}</td>
          {activeFilter ? (
            <td>
              <FontAwesomeIcon
                className="cursor-pointer"
                onClick={() => navigate(`/player/update/${player.id}`)}
                icon={faPenToSquare}
              />
            </td>
          ) : null}
          <td>
            <FontAwesomeIcon
              className="cursor-pointer"
              onClick={() => {
                setSelectedPlayer(player);
              }}
              icon={activeFilter ? faTrash : faUndoAlt}
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

      <Filter>
        <InputFilter
          id="searchFilter"
          type="text"
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
          labelText="Pretraži:"
        />
        <SwitchFilter
          id="activeFilter"
          text="Prikaži izbrisane"
          value={!activeFilter}
          onChange={(e) => setActiveFilter(!activeFilter)}
        />
        <PageLengthSelect
          id="pageLength"
          value={pageLength}
          onChange={(e) => setPageLength(e.target.value)}
        />
      </Filter>

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
        isActive={activeFilter}
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
