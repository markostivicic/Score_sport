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
import Button from "../../components/Button";
import {
  getLeaguesWithFiltersAsync,
  deleteLeagueByIdAsync,
} from "../../services/LeagueService";
import Background from "../../components/Background";
import Modal from "../../components/Modal";
import Filter from "../../components/filters/Filter";
import InputFilter from "../../components/filters/InputFilter";
import SwitchFilter from "../../components/filters/SwitchFilter";
import PageLengthSelect from "../../components/PageLengthSelect";
import { useResultContext } from "../../context/ResultContext";

export default function League() {
  const navigate = useNavigate();
  const [leagues, setLeagues] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [pageLength, setPageLength] = useState(5);
  const [selectedLeague, setSelectedLeague] = useState(null);
  const [activeFilter, setActiveFilter] = useState(true);
  const [searchFilter, setSearchFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState(`\"League\".\"Name\"`);
  const { lang } = useResultContext();

  const langParsed = JSON.parse(lang);

  useEffect(() => {
    fetchLeaguesAsync();
  }, [pageNumber, pageLength, activeFilter, searchFilter, orderBy, sortOrder]);

  const handleConfirmDelete = () => {
    deleteLeagueAsync(selectedLeague.id);
    setSelectedLeague(null);
  };

  const handleCancelDelete = () => {
    setSelectedLeague(null);
  };

  async function fetchLeaguesAsync() {
    const { items, totalCount } = await getLeaguesWithFiltersAsync(
      navigate,
      pageLength,
      pageNumber,
      activeFilter,
      searchFilter,
      orderBy,
      sortOrder
    );
    setLeagues(items);
    setPageCount(Math.ceil(totalCount / pageLength));
  }

  async function deleteLeagueAsync(id) {
    await deleteLeagueByIdAsync(id, navigate);
    fetchLeaguesAsync();
  }

  function handleSort(newSelectedOrder) {
    if (newSelectedOrder !== orderBy) {
      setOrderBy(newSelectedOrder);
      setSortOrder("asc");
      return;
    }
    sortOrder === "asc" ? setSortOrder("desc") : setSortOrder("asc");
  }

  function renderData() {
    return leagues.map((league) => {
      return (
        <tr key={league.id}>
          <td>{league.name}</td>
          <td>{league.sport.name}</td>
          <td>{league.country.name}</td>
          {activeFilter ? (
            <td>
              <FontAwesomeIcon
                className="cursor-pointer"
                onClick={() => navigate(`/league/update/${league.id}`)}
                icon={faPenToSquare}
              />
            </td>
          ) : null}
          <td>
            <FontAwesomeIcon
              className="cursor-pointer"
              onClick={() => {
                setSelectedLeague(league);
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

  const tableHeaders = [
    {
      name: langParsed.strName,
      handleOnClick: () => handleSort(`\"League\".\"Name\"`),
    },
    {
      name: langParsed.strSport,
      handleOnClick: () => handleSort(`\"Sport\".\"Name\"`),
    },
    {
      name: langParsed.strCountry,
      handleOnClick: () => handleSort(`\"Country\".\"Name\"`),
    },
  ];

  return (
    <Background>
      <Navbar />

      <Filter>
        <div className="dashboard-title">
          <h1>{langParsed.strLeague}</h1>
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
          selectedItem={selectedLeague}
          handleCancelDelete={handleCancelDelete}
          handleConfirmDelete={handleConfirmDelete}
        />
      </Table>

      <Button
        text={langParsed.strAdd}
        handleOnClick={() => navigate("/league/create")}
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
