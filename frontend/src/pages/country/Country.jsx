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
  getCountriesWithFiltersAsync,
  deleteCountryByIdAsync,
} from "../../services/CountryService";
import Button from "../../components/Button";
import Background from "../../components/Background";
import Modal from "../../components/Modal";
import Filter from "../../components/filters/Filter";
import InputFilter from "../../components/filters/InputFilter";
import SelectFilter from "../../components/filters/SelectFilter";
import SwitchFilter from "../../components/filters/SwitchFilter";
import PageLengthSelect from "../../components/PageLengthSelect";
import { useResultContext } from "../../context/ResultContext";

export default function Country() {
  const navigate = useNavigate();
  const [countries, setCountries] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [pageLength, setPageLength] = useState(5);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [activeFilter, setActiveFilter] = useState(true);
  const [sortOrder, setSortOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState(`\"Country\".\"Name\"`);
  const [searchFilter, setSearchFilter] = useState("");
  const { lang } = useResultContext();

  const langParsed = JSON.parse(lang);

  useEffect(() => {
    fetchCountriesAsync();
  }, [pageNumber, pageLength, activeFilter, sortOrder, orderBy, searchFilter]);

  const handleConfirmDelete = () => {
    deleteCountryAsync(selectedCountry.id);
    setSelectedCountry(null);
  };

  const handleCancelDelete = () => {
    setSelectedCountry(null);
  };

  function handleSort(newSelectedOrder) {
    if (newSelectedOrder !== orderBy) {
      setOrderBy(newSelectedOrder);
      setSortOrder("asc");
      return;
    }
    sortOrder === "asc" ? setSortOrder("desc") : setSortOrder("asc");
  }

  async function fetchCountriesAsync() {
    const { items, totalCount } = await getCountriesWithFiltersAsync(
      navigate,
      pageLength,
      pageNumber,
      sortOrder,
      orderBy,
      activeFilter,
      searchFilter
    );
    if (items.length === 0 && pageNumber > 0) {
      setPageNumber(pageNumber - 1);
      return;
    }
    setCountries(items);
    setPageCount(Math.ceil(totalCount / pageLength));
  }

  async function deleteCountryAsync(id) {
    await deleteCountryByIdAsync(id, navigate);
    fetchCountriesAsync();
  }

  function renderData() {
    return countries.map((country) => {
      return (
        <tr key={country.id}>
          <td>{country.name}</td>
          {activeFilter ? (
            <td>
              <FontAwesomeIcon
                className="cursor-pointer"
                onClick={() => navigate(`/country/update/${country.id}`)}
                icon={faPenToSquare}
              />
            </td>
          ) : null}
          <td>
            <FontAwesomeIcon
              className="cursor-pointer"
              onClick={() => {
                setSelectedCountry(country);
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
      handleOnClick: () => handleSort(`\"Country\".\"Name\"`),
    },
  ];

  return (
    <Background>
      <Navbar />

      <Filter>
        <div className="dashboard-title">
          <h1>{langParsed.strCountry}</h1>
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
          selectedItem={selectedCountry}
          handleCancelDelete={handleCancelDelete}
          handleConfirmDelete={handleConfirmDelete}
        />
      </Table>

      <Button
        text={langParsed.strAdd}
        handleOnClick={() => navigate("/country/create")}
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
