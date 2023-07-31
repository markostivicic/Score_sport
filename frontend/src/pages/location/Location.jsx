import React, { useEffect, useState } from "react";
import Table from "../../components/Table";
import Navbar from "../../components/Navbar";
import Pagination from "../../components/Pagination";
import API from "../../services/AxiosService";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { v4 as uuid } from "uuid";
import { toast } from "react-toastify";
import { getHeaders } from "../../services/AuthService";
import Button from "../../components/Button";

export default function Location() {
  const navigate = useNavigate();
  const [locations, setLocations] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [pageCount, setPageCount] = useState(1);

  const pageLength = 3;

  useEffect(() => {
    fetchLocationsAsync();
  }, [pageNumber]);

  async function fetchLocationsAsync() {
    try {
      await API.get(
        `/location?pageSize=${pageLength}&pageNumber=${pageNumber}`,
        {
          headers: getHeaders(),
        }
      ).then((response) => {
        setLocations(response.data.items);
        setPageCount(Math.ceil(response.data.totalCount / pageLength));
      });
    } catch (e) {
      console.log(e);
    }
  }

  async function deleteLocationAsync(id) {
    try {
      await API.delete(`/location/toggle/${id}`, {
        headers: getHeaders(),
      }).then(() => {
        fetchLocationsAsync();
        toast.success("Lokacija obrisan");
      });
    } catch (e) {
      toast.error("Lokacija nije obrisan");
      console.log(e);
    }
  }

  function renderData() {
    return locations.map((location) => {
      return (
        <tr key={uuid()}>
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
                if (
                  window.confirm(
                    "Jeste li sigurani da želite izbrisati lokaciju?"
                  )
                ) {
                  deleteLocationAsync(location.id);
                }
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
    <div>
      <Navbar />
      <Button
        handleOnClick={() => navigate("/location/create")}
        text="Dodaj lokaciju"
        color={"info"}
      />
      <Table
        tableHeaders={["Ime", "Adresa", "Država"]}
        renderData={renderData}
      />
      <Pagination pageCount={pageCount} changePage={changePage} />
    </div>
  );
}
