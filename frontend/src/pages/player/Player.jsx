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
import { useResultContext } from "../../context/ResultContext";

export default function Player() {
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [pageLength, setPageLength] = useState(5);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [activeFilter, setActiveFilter] = useState(true);
  const [searchFilter, setSearchFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState(`\"Player\".\"LastName\"`);
  const { lang } = useResultContext();

  const langParsed = JSON.parse(lang);

  useEffect(() => {
    fetchPlayersAsync();
  }, [pageNumber, pageLength, activeFilter, searchFilter, sortOrder, orderBy]);

  async function fetchPlayersAsync() {
    const { items, totalCount } = await getPlayersWithFiltersAsync(
      navigate,
      pageLength,
      pageNumber,
      activeFilter,
      searchFilter,
      orderBy,
      sortOrder
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

  function handleSort(newSelectedOrder) {
    if (newSelectedOrder !== orderBy) {
      setOrderBy(newSelectedOrder);
      setSortOrder("asc");
      return;
    }
    sortOrder === "asc" ? setSortOrder("desc") : setSortOrder("asc");
  }

  const tableHeaders = [
    {
      name: langParsed.strFirstName,
      handleOnClick: () => handleSort(`\"Player\".\"FirstName\"`),
    },
    {
      name: langParsed.strLastName,
      handleOnClick: () => handleSort(`\"Player\".\"LastName\"`),
    },
    { name: langParsed.strImage },
    {
      name: langParsed.strBirthDate,
      handleOnClick: () => handleSort(`\"Player\".\"DoB\"`),
    },
    {
      name: langParsed.strClub,
      handleOnClick: () => handleSort(`\"Club\".\"Name\"`),
    },
    {
      name: langParsed.strNationality,
      handleOnClick: () => handleSort(`\"Country\".\"Name\"`),
    },
  ];

  return (
    <Background>
      <Navbar />

      <Filter>
        <div className="dashboard-title">
          <h1>{langParsed.strPlayer}</h1>
        </div>
        <div className="d-flex flex-row align-items-center gap-5">
          <InputFilter
            id="searchFilter"
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            labelText={langParsed.strSearch}
          />
          <SwitchFilter
            id="activeFilter"
            text={langParsed.strShowDeleted}
            value={!activeFilter}
            onChange={(e) => setActiveFilter(!activeFilter)}
          />
          <PageLengthSelect
            id="pageLength"
            value={pageLength}
            onChange={(e) => setPageLength(e.target.value)}
          />
        </div>
      </Filter>

      <Table
        tableHeaders={tableHeaders}
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
        text={langParsed.strAdd}
        handleOnClick={() => navigate("/player/create")}
        margin="my-3"
      />
      <Pagination
        pageCount={pageCount}
        changePage={changePage}
        pageNumber={pageNumber}
      />
    </Background>
  );
}
