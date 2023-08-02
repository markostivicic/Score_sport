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
  deleteMatchByIdAsync,
  getMatchesWithFiltersAsync,
} from "../../services/MatchService";
import Background from "../../components/Background";
import Modal from "../../components/Modal";
import Button from "../../components/Button";
import PageLengthSelect from "../../components/PageLengthSelect";
import SwitchFilter from "../../components/filters/SwitchFilter";
import SelectFilter from "../../components/filters/SelectFilter";
import Filter from "../../components/filters/Filter";
import { extractDateAndTime } from "../../services/DateTimeService";

export default function Match() {
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [pageLength, setPageLength] = useState(5);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [orderBy, setOrderBy] = useState(`\"Match\".\"Time\"`);
  const [selectedFinishedFilter, setSelectedFinishedFilter] = useState("null");
  const [activeFilter, setActiveFilter] = useState(true);
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    fetchMatchesAsync();
  }, [
    pageNumber,
    pageLength,
    selectedFinishedFilter,
    activeFilter,
    orderBy,
    sortOrder,
  ]);

  async function fetchMatchesAsync() {
    const { items, totalCount } = await getMatchesWithFiltersAsync(
      navigate,
      pageLength,
      pageNumber,
      sortOrder,
      orderBy,
      selectedFinishedFilter,
      activeFilter
    );
    if (items.length === 0 && pageNumber > 0) {
      setPageNumber(pageNumber - 1);
      return;
    }
    setMatches(items);
    setPageCount(Math.ceil(totalCount / pageLength));
  }

  async function deleteMatchAsync(id) {
    await deleteMatchByIdAsync(id, navigate);
    fetchMatchesAsync();
  }

  function renderData() {
    return matches.map((match) => {
      return (
        <tr key={match.id}>
          <td>{extractDateAndTime(match.time)}</td>
          <td>{match.clubHome.name}</td>
          <td>{match.homeScore}</td>
          <td>{match.awayScore}</td>
          <td>{match.clubAway.name}</td>
          <td>{match.location.name}</td>
          {activeFilter ? (
            <td>
              <FontAwesomeIcon
                className="cursor-pointer"
                onClick={() => navigate(`/match/update/${match.id}`)}
                icon={faPenToSquare}
              />
            </td>
          ) : null}
          <td>
            <FontAwesomeIcon
              className="cursor-pointer"
              onClick={() => {
                setSelectedMatch(match);
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

  const handleConfirmDelete = () => {
    deleteMatchAsync(selectedMatch.id);
    setSelectedMatch(null);
  };

  const handleCancelDelete = () => {
    setSelectedMatch(null);
  };

  const orderFilterOptions = [
    { value: '"Match"."Time"', text: "Vrijeme" },
    { value: '"Location"."Name"', text: "Lokacija" },
    { value: 'clubHome."Name"', text: "Domaćin" },
    { value: 'clubAway."Name"', text: "Gost" },
  ];

  const finishedFilterOptions = [
    { value: "null", text: "Sve" },
    { value: "true", text: "Završene" },
    { value: "false", text: "Nisu završene" },
  ];

  const tableHeaders = [
    { name: "Vrijeme", handleOnClick: () => handleSort(`\"Match\".\"Time\"`) },
    { name: "Domaćin", handleOnClick: () => handleSort(`clubHome.\"Name\"`) },
    { name: "2Rezultat" },
    { name: "Gost", handleOnClick: () => handleSort(`clubAway.\"Name\"`) },
    {
      name: "Lokacija",
      handleOnClick: () => handleSort(`\"Location\".\"Name\"`),
    },
  ];

  function handleSort(newSelectedOrder) {
    if (newSelectedOrder !== orderBy) {
      setOrderBy(newSelectedOrder);
      setSortOrder("asc");
      return;
    }
    sortOrder === "asc" ? setSortOrder("desc") : setSortOrder("asc");
  }

  return (
    <Background>
      <Navbar />
      <Filter>
        <SelectFilter
          id="finishedFilter"
          options={finishedFilterOptions}
          value={selectedFinishedFilter}
          onChange={(e) => setSelectedFinishedFilter(e.target.value)}
          labelText="Utakmice:"
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
        tableHeaders={tableHeaders}
        renderData={renderData}
        isActive={activeFilter}
      >
        <Modal
          selectedItem={selectedMatch}
          handleCancelDelete={handleCancelDelete}
          handleConfirmDelete={handleConfirmDelete}
        />
      </Table>

      <Button
        text="Dodaj"
        handleOnClick={() => navigate("/match/create")}
        margin="my-3"
      />
      <Pagination pageCount={pageCount} changePage={changePage} />
    </Background>
  );
}
