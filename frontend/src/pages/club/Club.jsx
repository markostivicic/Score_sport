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
  getClubsWithFiltersAsync,
  deleteClubByIdAsync,
} from "../../services/ClubService";
import Button from "../../components/Button";
import Background from "../../components/Background";
import Modal from "../../components/Modal";
import Filter from "../../components/filters/Filter";
import InputFilter from "../../components/filters/InputFilter";
import SwitchFilter from "../../components/filters/SwitchFilter";
import PageLengthSelect from "../../components/PageLengthSelect";
import { useResultContext } from "../../context/ResultContext";

export default function Club() {
  const navigate = useNavigate();
  const [clubs, setClubs] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [pageLength, setPageLength] = useState(5);
  const [selectedClub, setSelectedClub] = useState(null);
  const [activeFilter, setActiveFilter] = useState(true);
  const [searchFilter, setSearchFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState(`\"Club\".\"Name\"`);

  const { lang } = useResultContext();
  const langParsed = JSON.parse(lang);

  useEffect(() => {
    fetchClubsAsync();
  }, [pageNumber, pageLength, activeFilter, searchFilter, sortOrder, orderBy]);

  async function fetchClubsAsync() {
    const { items, totalCount } = await getClubsWithFiltersAsync(
      navigate,
      pageLength,
      pageNumber,
      activeFilter,
      searchFilter,
      orderBy,
      sortOrder
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

  function handleSort(newSelectedOrder) {
    if (newSelectedOrder !== orderBy) {
      setOrderBy(newSelectedOrder);
      setSortOrder("asc");
      return;
    }
    sortOrder === "asc" ? setSortOrder("desc") : setSortOrder("asc");
  }

  function renderData() {
    return clubs.map((club) => {
      return (
        <tr key={club.id}>
          <td>{club.name}</td>
          <td>
            <img src={club.logo} className="clublogo" alt="logo" />
          </td>
          <td>{club.league.name}</td>
          <td>{club.location.name}</td>
          {activeFilter ? (
            <td>
              <FontAwesomeIcon
                className="cursor-pointer"
                onClick={() => navigate(`/club/update/${club.id}`)}
                icon={faPenToSquare}
              />
            </td>
          ) : null}
          <td>
            <FontAwesomeIcon
              className="cursor-pointer"
              onClick={() => {
                setSelectedClub(club);
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
      handleOnClick: () => handleSort(`\"Club\".\"Name\"`),
    },
    { name: langParsed.strLogo },
    {
      name: langParsed.strLeague,
      handleOnClick: () => handleSort(`\"League\".\"Name\"`),
    },
    {
      name: langParsed.strLocation,
      handleOnClick: () => handleSort(`\"Location\".\"Name\"`),
    },
  ];

  return (
    <Background>
      <Navbar />

      <Filter>
        <div className="dashboard-title">
          <h1>{langParsed.strClub}</h1>
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
          selectedItem={selectedClub}
          handleCancelDelete={handleCancelDelete}
          handleConfirmDelete={handleConfirmDelete}
        />
      </Table>

      <Button
        text={langParsed.strAdd}
        handleOnClick={() => navigate("/club/create")}
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
