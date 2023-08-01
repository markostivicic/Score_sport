import React, { useEffect, useState } from "react";
import Table from "../../components/Table";
import Navbar from "../../components/Navbar";
import Pagination from "../../components/Pagination";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash, faUndoAlt } from "@fortawesome/free-solid-svg-icons";
import {
  getSportsWithFiltersAsync,
  deleteSportByIdAsync,
} from "../../services/SportService";
import Button from "../../components/Button";
import Background from "../../components/Background";
import Modal from "../../components/Modal";
import Filter from "../../components/filters/Filter";
import InputFilter from "../../components/filters/InputFilter";
import SelectFilter from "../../components/filters/SelectFilter";
import SwitchFilter from "../../components/filters/SwitchFilter";
import PageLengthSelect from "../../components/PageLengthSelect";

export default function Sport() {
  const navigate = useNavigate();
  const [sports, setSports] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [pageLength, setPageLength] = useState(5);
  const [selectedSport, setSelectedSport] = useState(null);
  const [activeFilter, setActiveFilter] = useState(true)
  const [sortOrderFilter, setSortOrderFilter] = useState(true)
  const [selectedOrderByFilter, setSlectedOrderByFilter] = useState(`\"Sport\".\"Name\"`)
  const [searchFilter, setSearchFilter] = useState("")

  useEffect(() => {
    fetchSportsAsync();
  }, [pageNumber, pageLength, activeFilter, sortOrderFilter, selectedOrderByFilter, searchFilter]);

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
      sortOrderFilter ? "asc" : "desc",
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
          {activeFilter ? (<td>
            <FontAwesomeIcon
              className="cursor-pointer"
              onClick={() => navigate(`/sport/update/${sport.id}`)}
              icon={faPenToSquare}
            />
          </td>) : null}
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

  return (
    <Background>
      <Navbar />

      <Filter>
        <InputFilter
          id="searchFilter"
          type="text"
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
          labelText="Pretraži:" />
        <SelectFilter
          id="orderFilter"
          options={[{ value: "\"Sport\".\"Name\"", text: "Ime" }]}
          value={selectedOrderByFilter}
          onChange={(e) => setSlectedOrderByFilter(e.target.value)}
          isDisabled={true}
          labelText="Poredaj po:"
        />
        <SwitchFilter
          id="sortOrderFilter"
          text="Rastući redoslijed"
          value={sortOrderFilter}
          onChange={(e) => setSortOrderFilter(!sortOrderFilter)}
        />
        <SwitchFilter
          id="activeFilter"
          text="Prikaži izbrisane"
          value={!activeFilter}
          onChange={(e) => setActiveFilter(!activeFilter)}
        />
        <PageLengthSelect id="pageLength" value={pageLength} onChange={(e) => setPageLength(e.target.value)} />
      </Filter>

      <Table tableHeaders={["Ime"]} renderData={renderData} isActive={activeFilter}>
        <Modal
          selectedItem={selectedSport}
          handleCancelDelete={handleCancelDelete}
          handleConfirmDelete={handleConfirmDelete}
        />
      </Table>

      <Button
        text="Dodaj"
        handleOnClick={() => navigate("/sport/create")}
        margin="my-3"
      />
      <Pagination pageCount={pageCount} changePage={changePage} />
    </Background>
  );
}
