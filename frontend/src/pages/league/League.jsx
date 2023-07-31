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

export default function League() {
  const navigate = useNavigate();
  const [leagues, setLeagues] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [pageCount, setPageCount] = useState(1);

  const pageLength = 3;

  useEffect(() => {
    fetchLeaguesAsync();
  }, [pageNumber]);

  async function fetchLeaguesAsync() {
    try {
      await API.get(`/league?pageSize=${pageLength}&pageNumber=${pageNumber}`, {
        headers: getHeaders(),
      }).then((response) => {
        setLeagues(response.data.items);
        setPageCount(Math.ceil(response.data.totalCount / pageLength));
      });
    } catch (e) {
      console.log(e);
    }
  }

  async function deleteLeagueAsync(id) {
    try {
      await API.delete(`/league/toggle/${id}`, {
        headers: getHeaders(),
      }).then(() => {
        fetchLeaguesAsync();
        toast.success("Liga obrisana");
      });
    } catch (e) {
      toast.error("Liga nije obrisana");
      console.log(e);
    }
  }

  function renderData() {
    return leagues.map((league) => {
      return (
        <tr key={uuid()}>
          <td>{league.name}</td>
          <td>{league.sport.name}</td>
          <td>{league.country.name}</td>
          <td>
            <FontAwesomeIcon
              className="cursor-pointer"
              onClick={() => navigate(`/league/update/${league.id}`)}
              icon={faPenToSquare}
            />
          </td>
          <td>
            <FontAwesomeIcon
              className="cursor-pointer"
              onClick={() => {
                if (
                  window.confirm("Jeste li sigurani da želite izbrisati ligu?")
                ) {
                  deleteLeagueAsync(league.id);
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
        handleOnClick={() => navigate("/league/create")}
        text="Dodaj ligu"
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
