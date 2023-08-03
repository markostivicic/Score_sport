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
  getLocationsWithFiltersAsync,
  deleteLocationByIdAsync,
} from "../../services/LocationService";
import Background from "../../components/Background";
import Modal from "../../components/Modal";
import Filter from "../../components/filters/Filter";
import InputFilter from "../../components/filters/InputFilter";
import SwitchFilter from "../../components/filters/SwitchFilter";
import PageLengthSelect from "../../components/PageLengthSelect";
import { useResultContext } from "../../context/ResultContext";

export default function Location() {
  const navigate = useNavigate();
  const [locations, setLocations] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [pageLength, setPageLength] = useState(5);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [activeFilter, setActiveFilter] = useState(true);
  const [searchFilter, setSearchFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState(`\"Location\".\"Name\"`);
  const { lang } = useResultContext();

  const langParsed = JSON.parse(lang);

  useEffect(() => {
    fetchLocationsAsync();
  }, [pageNumber, pageLength, activeFilter, searchFilter, sortOrder, orderBy]);

  const handleConfirmDelete = () => {
    deleteLocationAsync(selectedLocation.id);
    setSelectedLocation(null);
  };

  const handleCancelDelete = () => {
    setSelectedLocation(null);
  };

  async function fetchLocationsAsync() {
    const { items, totalCount } = await getLocationsWithFiltersAsync(
      navigate,
      pageLength,
      pageNumber,
      activeFilter,
      searchFilter,
      orderBy,
      sortOrder
    );
    setLocations(items);
    setPageCount(Math.ceil(totalCount / pageLength));
  }

  async function deleteLocationAsync(id) {
    await deleteLocationByIdAsync(id, navigate);
    fetchLocationsAsync();
  }

  function renderData() {
    return locations.map((location) => {
      return (
        <tr key={location.id}>
          <td>{location.name}</td>
          <td>{location.address}</td>
          <td>{location.country.name}</td>
          {activeFilter ? (
            <td>
              <FontAwesomeIcon
                className="cursor-pointer"
                onClick={() => navigate(`/location/update/${location.id}`)}
                icon={faPenToSquare}
              />
            </td>
          ) : null}
          <td>
            <FontAwesomeIcon
              className="cursor-pointer"
              onClick={() => {
                setSelectedLocation(location);
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
      name: langParsed.strName,
      handleOnClick: () => handleSort(`\"Location\".\"Name\"`),
    },
    {
      name: langParsed.strAddress,
      handleOnClick: () => handleSort(`\"Location\".\"Address\"`),
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
          <h1>{langParsed.strLocation}</h1>
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
          selectedItem={selectedLocation}
          handleCancelDelete={handleCancelDelete}
          handleConfirmDelete={handleConfirmDelete}
        />
      </Table>
      <Button
        text={langParsed.strAdd}
        handleOnClick={() => navigate("/location/create")}
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
