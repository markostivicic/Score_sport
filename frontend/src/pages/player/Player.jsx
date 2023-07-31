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
  const [players, setPlayers] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [pageCount, setPageCount] = useState(1);

  const pageLength = 3;

  useEffect(() => {
    fetchPlayersAsync();
  }, [pageNumber]);
  console.log(players);
  async function fetchPlayersAsync() {
    try {
      await API.get(`/player?pageSize=${pageLength}&pageNumber=${pageNumber}`, {
        headers: getHeaders(),
      }).then((response) => {
        setPlayers(response.data.items);
        setPageCount(Math.ceil(response.data.totalCount / pageLength));
      });
    } catch (e) {
      console.log(e);
    }
  }

  async function deletePlayerAsync(id) {
    try {
      await API.delete(`/player/toggle/${id}`, {
        headers: getHeaders(),
      }).then(() => {
        fetchPlayersAsync();
        toast.success("Igrač obrisan");
      });
    } catch (e) {
      toast.error("Igrač nije obrisan");
      console.log(e);
    }
  }

  function renderData() {
    return players.map((player) => {
      return (
        <tr key={uuid()}>
          <td>{player.firstName}</td>
          <td>{player.lastName}</td>
          <td>
            <img src={player.image} className="playerlogo" alt="player" />
          </td>
          <td>{player.doB}</td>
          <td>{player.club.name}</td>
          <td>{player.country.name}</td>
          <td>
            <FontAwesomeIcon
              className="cursor-pointer"
              onClick={() => navigate(`/player/update/${player.id}`)}
              icon={faPenToSquare}
            />
          </td>
          <td>
            <FontAwesomeIcon
              className="cursor-pointer"
              onClick={() => {
                if (
                  window.confirm("Jeste li sigurni da želite izbrisati igrača?")
                ) {
                  deletePlayerAsync(player.id);
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
        tableHeaders={[
          "Ime",
          "Prezime",
          "Slika",
          "Datum rođenja",
          "Klub",
          "Nacionalnost",
        ]}
        renderData={renderData}
      />
      <Pagination pageCount={pageCount} changePage={changePage} />
    </div>
  );
}
