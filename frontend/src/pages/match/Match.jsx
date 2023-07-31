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

export default function Match() {
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [pageCount, setPageCount] = useState(1);

  const pageLength = 3;

  useEffect(() => {
    fetchMatchesAsync();
  }, [pageNumber]);

  async function fetchMatchesAsync() {
    try {
      await API.get(`/match?pageSize=${pageLength}&pageNumber=${pageNumber}&isFinished=${false}`, {
        headers: getHeaders(),
      }).then((response) => {
        setMatches(response.data.items);
        setPageCount(Math.ceil(response.data.totalCount / pageLength));
      });
    } catch (e) {
      console.log(e);
    }
  }

  async function deleteMatchAsync(id) {
    try {
      await API.delete(`/match/toggle/${id}`, {
        headers: getHeaders(),
      }).then(() => {
        fetchMatchesAsync();
        toast.success("Utakmica izbrisana");
      });
    } catch (e) {
      toast.error("Utakmica nije izbrisana");
      console.log(e);
    }
  }

  function renderData() {
    return matches.map((match) => {
      return (
        <tr key={uuid()}>
          <td>{extractDate(match.time)}</td>
          <td>{match.clubHome.name}</td>
          <td>{match.homeScore}</td>
          <td>{match.awayScore}</td>
          <td>{match.clubAway.name}</td>
          <td>{match.location.name}</td>
          <td>
            <FontAwesomeIcon
              className="cursor-pointer"
              onClick={() => navigate(`/match/update/${match.id}`)}
              icon={faPenToSquare}
            />
          </td>
          <td>
            <FontAwesomeIcon
              className="cursor-pointer"
              onClick={() => {
                if (
                  window.confirm("Jeste li sigurni da želite izbrisati utakmicu?")
                ) {
                  deleteMatchAsync(match.id);
                }
              }}
              icon={faTrash}
            />
          </td>
        </tr>
      );
    });
  }

  function extractDate(fullDate) {
    const date = new Date(fullDate);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${day}.${month}.${year}. ${hours.toString() + ":" + minutes.toString().padStart(2, "0")}`;
  }

  const changePage = ({ selected }) => {
    setPageNumber(selected + 1);
  };

  return (
    <div>
      <Navbar />
      <Table tableHeaders={["Vrijeme", "Domaćin", "Rezultat", "Rezultat", "Gost", "Lokacija"]} renderData={renderData} />
      <Pagination pageCount={pageCount} changePage={changePage} />
    </div>
  );
}

