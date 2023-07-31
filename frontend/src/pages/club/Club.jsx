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

export default function Club() {
  const navigate = useNavigate();
  const [clubs, setClubs] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [pageCount, setPageCount] = useState(1);

  const pageLength = 3;

  useEffect(() => {
    fetchClubsAsync();
  }, [pageNumber]);
  console.log(clubs);
  async function fetchClubsAsync() {
    try {
      await API.get(`/club?pageSize=${pageLength}&pageNumber=${pageNumber}`, {
        headers: getHeaders(),
      }).then((response) => {
        setClubs(response.data.items);
        setPageCount(Math.ceil(response.data.totalCount / pageLength));
      });
    } catch (e) {
      console.log(e);
    }
  }

  async function deleteClubAsync(id) {
    try {
      await API.delete(`/club/toggle/${id}`, {
        headers: getHeaders(),
      }).then(() => {
        fetchClubsAsync();
        toast.success("Klub obrisan");
      });
    } catch (e) {
      toast.error("Klub nije obrisan");
      console.log(e);
    }
  }

  function renderData() {
    return clubs.map((club) => {
      return (
        <tr key={uuid()}>
          <td>{club.name}</td>
          <td>
            <img src={club.logo} className="clublogo" alt="logo" />
          </td>
          <td>{club.league.name}</td>
          <td>{club.location.name}</td>
          <td>
            <FontAwesomeIcon
              className="cursor-pointer"
              onClick={() => navigate(`/club/update/${club.id}`)}
              icon={faPenToSquare}
            />
          </td>
          <td>
            <FontAwesomeIcon
              className="cursor-pointer"
              onClick={() => {
                if (
                  window.confirm("Jeste li sigurni da želite izbrisati klub?")
                ) {
                  deleteClubAsync(club.id);
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
      <Table
        tableHeaders={["Ime", "Logo", "Liga", "Lokacija"]}
        renderData={renderData}
      />
      <Pagination pageCount={pageCount} changePage={changePage} />
    </div>
  );
}
