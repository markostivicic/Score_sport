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

export default function Country() {
  const navigate = useNavigate();
  const [countrys, setCountrys] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [pageCount, setPageCount] = useState(1);

  const pageLength = 3;

  useEffect(() => {
    fetchCountrysAsync();
  }, [pageNumber]);

  async function fetchCountrysAsync() {
    try {
      await API.get(
        `/country?pageSize=${pageLength}&pageNumber=${pageNumber}`,
        {
          headers: getHeaders(),
        }
      ).then((response) => {
        setCountrys(response.data.items);
        setPageCount(Math.ceil(response.data.totalCount / pageLength));
      });
    } catch (e) {
      console.log(e);
    }
  }

  async function deleteCountryAsync(id) {
    try {
      await API.delete(`/country/toggle/${id}`, {
        headers: getHeaders(),
      }).then(() => {
        fetchCountrysAsync();
        toast.success("Država obrisana");
      });
    } catch (e) {
      toast.error("Država nije obrisana");
      console.log(e);
    }
  }

  function renderData() {
    return countrys.map((country) => {
      return (
        <tr key={uuid()}>
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
                if (
                  window.confirm(
                    "Jeste li sigurani da želite izbrisati državu?"
                  )
                ) {
                  deleteCountryAsync(country.id);
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
        handleOnClick={() => navigate("/country/create")}
        text="Dodaj državu"
        color={"info"}
      />
      <Table tableHeaders={["Name"]} renderData={renderData} />
      <Pagination pageCount={pageCount} changePage={changePage} />
    </div>
  );
}
