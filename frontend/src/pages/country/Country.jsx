import React, { useEffect, useState } from "react";
import Table from "../../components/Table";
import Navbar from "../../components/Navbar";
import Pagination from "../../components/Pagination";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import {
  getCountrysAsync,
  deleteCountryByIdAsync,
} from "../../services/CountryService";
import Button from "../../components/Button";
import Background from "../../components/Background";
import Modal from "../../components/Modal";

export default function Country() {
  const navigate = useNavigate();
  const [countrys, setCountrys] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [selectedCountry, setSelectedCountry] = useState(null);

  const pageLength = 3;

  useEffect(() => {
    fetchCountrysAsync();
  }, [pageNumber]);

  const handleConfirmDelete = () => {
    deleteCountryAsync(selectedCountry.id);
    setSelectedCountry(null);
  };

  const handleCancelDelete = () => {
    setSelectedCountry(null);
  };

  async function fetchCountrysAsync() {
    const { items, totalCount } = await getCountrysAsync(
      navigate,
      pageLength,
      pageNumber
    );
    setCountrys(items);
    setPageCount(Math.ceil(totalCount / pageLength));
  }

  async function deleteCountryAsync(id) {
    await deleteCountryByIdAsync(id, navigate);
    fetchCountrysAsync();
  }

  function renderData() {
    return countrys.map((country) => {
      return (
        <tr key={country.id}>
          <td>{country.name}</td>
          <td>
            <FontAwesomeIcon
              className="cursor-pointer"
              onClick={() => navigate(`/country/update/${country.id}`)}
              icon={faPenToSquare}
            />
          </td>
          <td>
            <FontAwesomeIcon
              className="cursor-pointer"
              onClick={() => {
                setSelectedCountry(country);
              }}
              icon={faTrash}
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
      <Table tableHeaders={["Ime"]} renderData={renderData}>
        <Modal
          selectedItem={selectedCountry}
          handleCancelDelete={handleCancelDelete}
          handleConfirmDelete={handleConfirmDelete}
        />
      </Table>
      <Button
        text="Dodaj"
        handleOnClick={() => navigate("/country/create")}
        margin="my-3"
      />
      <Pagination pageCount={pageCount} changePage={changePage} />
    </Background>
  );
}
