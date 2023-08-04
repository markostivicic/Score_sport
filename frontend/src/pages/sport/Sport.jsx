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
  getSportsWithFiltersAsync,
  deleteSportByIdAsync,
} from "../../services/SportService";
import Button from "../../components/Button";
import Background from "../../components/Background";
import Modal from "../../components/Modal";
import Filter from "../../components/filters/Filter";
import InputFilter from "../../components/filters/InputFilter";
import SwitchFilter from "../../components/filters/SwitchFilter";
import PageLengthSelect from "../../components/PageLengthSelect";
import { useResultContext } from "../../context/ResultContext";

export default function Sport() {
  const navigate = useNavigate();
  const [sports, setSports] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [pageLength, setPageLength] = useState(5);
  const [selectedSport, setSelectedSport] = useState(null);
  const [activeFilter, setActiveFilter] = useState(true);
  const [sortOrderFilter, setSortOrderFilter] = useState("asc");
  const [selectedOrderByFilter, setSlectedOrderByFilter] =
    useState(`\"Sport\".\"Name\"`);
  const [searchFilter, setSearchFilter] = useState("");
  const { lang } = useResultContext();

  const langParsed = JSON.parse(lang);

  useEffect(() => {
    fetchSportsAsync();
  }, [
    pageNumber,
    pageLength,
    activeFilter,
    sortOrderFilter,
    selectedOrderByFilter,
    searchFilter,
  ]);

  function handleSort(newSelectedOrder) {
    if (newSelectedOrder !== selectedOrderByFilter) {
      setSlectedOrderByFilter(newSelectedOrder);
      setSortOrderFilter("asc");
      return;
    }
    sortOrderFilter === "asc"
      ? setSortOrderFilter("desc")
      : setSortOrderFilter("asc");
  }

  const handleConfirmDelete = () => {
    deleteSportAsync(selectedSport.id);
    setSelectedSport(null);
  };

  const handleCancelDelete = () => {
    setSelectedSport(null);
  };

  async function fetchSportsAsync() {
    const { items, totalCount } = await getSportsWithFiltersAsync(
      navigate,
      pageLength,
      pageNumber,
      sortOrderFilter,
      selectedOrderByFilter,
      activeFilter,
      searchFilter
    );
    if (items.length === 0 && pageNumber > 0) {
      setPageNumber(pageNumber - 1);
      return;
    }
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
          {activeFilter ? (
            <td>
              <FontAwesomeIcon
                className="cursor-pointer"
                onClick={() => navigate(`/sport/update/${sport.id}`)}
                icon={faPenToSquare}
              />
            </td>
          ) : null}
          <td>
            <FontAwesomeIcon
              className="cursor-pointer"
              onClick={() => {
                setSelectedSport(sport);
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
      handleOnClick: () => {
        handleSort(`\"Sport\".\"Name\"`);
      },
    },
  ];

  return (
    <Background>
      <Navbar />

      <Filter>
        <div className="dashboard-title">
          <h1>{langParsed.strSport}</h1>
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
          activeFilter={activeFilter}
          selectedItem={selectedSport}
          handleCancelDelete={handleCancelDelete}
          handleConfirmDelete={handleConfirmDelete}
        />
      </Table>

      <Button
        text={langParsed.strAdd}
        handleOnClick={() => navigate("/sport/create")}
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
