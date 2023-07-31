import React, { useEffect, useState } from "react";
import Table from "../../components/Table";
import Navbar from "../../components/Navbar";
import Pagination from "../../components/Pagination";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import Button from "../../components/Button";
import {
  getLocationsAsync,
  deleteLocationByIdAsync,
} from "../../services/LocationService";
import Background from "../../components/Background";
import Modal from "../../components/Modal";

export default function Location() {
  const navigate = useNavigate();
  const [locations, setLocations] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const pageLength = 3;

  useEffect(() => {
    fetchLocationsAsync();
  }, [pageNumber]);

  const handleConfirmDelete = () => {
    deleteLocationAsync(selectedLocation.id);
    setSelectedLocation(null);
  };

  const handleCancelDelete = () => {
    setSelectedLocation(null);
  };

  async function fetchLocationsAsync() {
    const { items, totalCount } = await getLocationsAsync(
      navigate,
      pageLength,
      pageNumber
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
          <td>
            <FontAwesomeIcon
              className="cursor-pointer"
              onClick={() => navigate(`/location/update/${location.id}`)}
              icon={faPenToSquare}
            />
          </td>
          <td>
            <FontAwesomeIcon
              className="cursor-pointer"
              onClick={() => {
                setSelectedLocation(location);
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
      <Table tableHeaders={["Ime", "Adresa", "Država"]} renderData={renderData}>
        <Modal
          selectedItem={selectedLocation}
          handleCancelDelete={handleCancelDelete}
          handleConfirmDelete={handleConfirmDelete}
        />
      </Table>
      <Button
        text="Dodaj"
        handleOnClick={() => navigate("/location/create")}
        margin="my-3"
      />
      <Pagination pageCount={pageCount} changePage={changePage} />
    </Background>
  );
}
