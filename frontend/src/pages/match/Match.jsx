import React, { useEffect, useState } from "react";
import Table from "../../components/Table";
import Navbar from "../../components/Navbar";
import Pagination from "../../components/Pagination";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash, faUndoAlt } from "@fortawesome/free-solid-svg-icons";
import { deleteMatchByIdAsync, getMatchesWithFiltersAsync } from "../../services/MatchService";
import Background from "../../components/Background";
import Modal from "../../components/Modal";
import Button from "../../components/Button";
import PageLengthSelect from "../../components/PageLengthSelect";
import SwitchFilter from "../../components/filters/SwitchFilter";
import SelectFilter from "../../components/filters/SelectFilter";
import Filter from "../../components/filters/Filter";

export default function Match() {
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [pageLength, setPageLength] = useState(5);
  const [selectedMatch, setSelectedMatch] = useState(null)
  const [selectedOrderByFilter, setSlectedOrderByFilter] = useState(`\"Match\".\"Time\"`)
  const [selectedFinishedFilter, setSelectedFinishedFilter] = useState("null")
  const [activeFilter, setActiveFilter] = useState(true)
  const [sortOrderFilter, setSortOrderFilter] = useState(true)

  useEffect(() => {
    fetchMatchesAsync();
  }, [pageNumber, pageLength, selectedFinishedFilter, activeFilter, selectedOrderByFilter, sortOrderFilter]);


  async function fetchMatchesAsync() {
    const { items, totalCount } = await getMatchesWithFiltersAsync(navigate, pageLength, pageNumber, sortOrderFilter ? "asc" : "desc", selectedOrderByFilter, selectedFinishedFilter, activeFilter)
    if (items.length === 0 && pageNumber > 0) {
      setPageNumber(pageNumber - 1);
      return;
    }
    setMatches(items);
    setPageCount(Math.ceil(totalCount / pageLength));
  }

  async function deleteMatchAsync(id) {
    await deleteMatchByIdAsync(id, navigate)
    fetchMatchesAsync();
  }

  function renderData() {
    return matches.map((match) => {
      return (
        <tr key={match.id}>
          <td>{extractDate(match.time)}</td>
          <td>{match.clubHome.name}</td>
          <td>{match.homeScore}</td>
          <td>{match.awayScore}</td>
          <td>{match.clubAway.name}</td>
          <td>{match.location.name}</td>
          {activeFilter ? (<td>
            <FontAwesomeIcon
              className="cursor-pointer"
              onClick={() => navigate(`/match/update/${match.id}`)}
              icon={faPenToSquare}
            />
          </td>) : null}
          <td>
            <FontAwesomeIcon
              className="cursor-pointer"
              onClick={() => {
                setSelectedMatch(match)
              }}
              icon={activeFilter ? faTrash : faUndoAlt}
            />
          </td>
        </tr>
      );
    });
  }

  function extractDate(fullDate) {
    const date = new Date(fullDate);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${day}.${month}.${year}. ${hours.toString() + ":" + minutes.toString().padStart(2, "0")}`;
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
    { value: "\"Match\".\"Time\"", text: "Vrijeme" },
    { value: "\"Location\".\"Name\"", text: "Lokacija" },
    { value: "clubHome.\"Name\"", text: "Domaćin" },
    { value: "clubAway.\"Name\"", text: "Gost" },
  ];

  const finishedFilterOptions = [
    { value: "null", text: "Sve" },
    { value: "true", text: "Završene" },
    { value: "false", text: "Nisu završene" },
  ];

  return (
    <Background>
      <Navbar />
      <Filter>
        <SelectFilter
          id="orderFilter"
          options={orderFilterOptions}
          value={selectedOrderByFilter}
          onChange={(e) => setSlectedOrderByFilter(e.target.value)}
          labelText="Poredaj po:"
        />
        <SwitchFilter
          id="sortOrderFilter"
          text="Rastući redoslijed"
          value={sortOrderFilter}
          onChange={(e) => setSortOrderFilter(!sortOrderFilter)}
        />
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
        <PageLengthSelect id="pageLength" value={pageLength} onChange={(e) => setPageLength(e.target.value)} />
      </Filter>

      <Table tableHeaders={["Vrijeme", "Domaćin", "2Rezultat", "Gost", "Lokacija"]} renderData={renderData} isActive={activeFilter}>
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

