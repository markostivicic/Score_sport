import React, { useEffect, useState } from "react";
import Table from "../../components/Table";
import Navbar from "../../components/Navbar";
import Pagination from "../../components/Pagination";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { deleteMatchByIdAsync, getMatchesAsync } from "../../services/MatchService";
import Background from "../../components/Background";
import Modal from "../../components/Modal";
import Button from "../../components/Button";
import PageLengthSelect from "../../components/PageLengthSelect";

export default function Match() {
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [pageLength, setPageLength] = useState(5);
  const [selectedMatch, setSelectedMatch] = useState(null)

  useEffect(() => {
    fetchMatchesAsync();
  }, [pageNumber, pageLength]);


  async function fetchMatchesAsync() {
    const { items, totalCount } = await getMatchesAsync(navigate, pageLength, pageNumber)
    if (items.length === 0 && pageNumber > 0) {
      setPageNumber(pageNumber - 1);
      return;
    }
    setMatches(items);
    setPageCount(Math.ceil(totalCount / pageLength));
  }

  async function deleteMatchAsync(id) {
    await deleteMatchByIdAsync(id, navigate)
    fetchMatchesAsync();
  }

  function renderData() {
    return matches.map((match) => {
      return (
        <tr key={match.id}>
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
                setSelectedMatch(match)
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

  const handleConfirmDelete = () => {
    deleteMatchAsync(selectedMatch.id);
    setSelectedMatch(null);
  };

  const handleCancelDelete = () => {
    setSelectedMatch(null);
  };

  return (
    <Background>
      <Navbar />
      <PageLengthSelect id="pageLength" value={pageLength} onChange={(e) => setPageLength(e.target.value)} />
      <Table tableHeaders={["Vrijeme", "Domaćin", "2Rezultat", "Gost", "Lokacija"]} renderData={renderData}>
        <Modal
          selectedItem={selectedMatch}
          handleCancelDelete={handleCancelDelete}
          handleConfirmDelete={handleConfirmDelete}
        />
      </Table>
      <Button
        text="Dodaj"
        handleOnClick={() => navigate("/match/create")}
        margin="my-3"
      />
      <Pagination pageCount={pageCount} changePage={changePage} />

    </Background>
  );
}

