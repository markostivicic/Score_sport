import React, { useEffect, useState } from "react";
import Table from "../components/Table";
import Navbar from "../components/Navbar";
import { getPlayersFilteredByClubAsync } from "../services/PlayerService";
import { useNavigate, useParams } from "react-router-dom";
import ClubNavbar from "../components/SinglePage/ClubNavbar";
import { useResultContext } from "../context/ResultContext";
import { getMatchesFilteredByClubAndFinishedAsync } from "../services/MatchService";
import { extractDateAndTime } from "../services/DateTimeService";
import ReactPaginate from "react-paginate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";

export default function SingleClub() {
  const { id } = useParams();
  const { currentClubTab } = useResultContext();
  const [players, setPlayers] = useState([]);
  const [matches, setMatches] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [pageLength, setPageLength] = useState(5);
  const [matchOrderBy, setMatchOrderBy] = useState(`\"Match\".\"Time\"`);
  const [matchSortOrder, setMatchSortOrder] = useState("asc");
  const [playerSortOrder, setPlayerSortOrder] = useState("asc");
  const [playerOrderBy, setPlayerOrderBy] = useState(`\"Player\".\"LastName\"`);

  const navigate = useNavigate();

  useEffect(() => {
    if (currentClubTab === "players") {
      fetchPlayersAsync();
    }
    else if (currentClubTab === "results") {
      fetchMatchesByFinishedAsync(true);
    }
    else if (currentClubTab === "schedule") {
      fetchMatchesByFinishedAsync(false);
    }
  }, [currentClubTab, pageNumber, pageLength, playerOrderBy, playerSortOrder, matchOrderBy, matchSortOrder]);

  async function fetchPlayersAsync() {
    const { items, totalCount } = await getPlayersFilteredByClubAsync(navigate, pageLength, pageNumber + 1, id, playerOrderBy, playerSortOrder);
    if (items.length === 0 && pageNumber > 0) {
      setPageNumber(pageNumber - 1);
      return;
    }
    setPageCount(Math.ceil(totalCount / pageLength));
    setPlayers(items);
  }

  async function fetchMatchesByFinishedAsync(isFinished) {
    const { items, totalCount } = await getMatchesFilteredByClubAndFinishedAsync(navigate, pageLength, pageNumber + 1, id, isFinished, matchOrderBy, matchSortOrder);
    if (items.length === 0 && pageNumber > 0) {
      setPageNumber(pageNumber - 1);
      return;
    }
    setPageCount(Math.ceil(totalCount / pageLength));
    setMatches(items);
  }

  function renderPlayers() {
    return players.map((player) => {
      return (
        <tr key={player.id}>
          <td>{player.firstName}</td>
          <td>{player.lastName}</td>
          <td>
            <img src={player.image} className="playerlogo" alt="player" />
          </td>
          <td>{player.doB}</td>
          <td>{player.club.name}</td>
          <td>{player.country.name}</td>
        </tr>
      );
    });
  }

  function renderMatches() {
    return matches.map((match) => {
      return (
        <tr key={match.id} onClick={() => navigate(`/single-match/${match.id}`)}>
          <td>{extractDateAndTime(match.time)}</td>
          <td>{match.clubHome.name}</td>
          <td>{match.homeScore}</td>
          <td>{match.awayScore}</td>
          <td>{match.clubAway.name}</td>
          <td>{match.location.name}</td>
        </tr>
      );
    });
  }

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  function handlePlayerSort(newSelectedOrder) {
    if (newSelectedOrder !== playerOrderBy) {
      setPlayerOrderBy(newSelectedOrder);
      setPlayerSortOrder("asc");
      return;
    }
    playerSortOrder === "asc" ? setPlayerSortOrder("desc") : setPlayerSortOrder("asc");
  }

  function handleMatchSort(newSelectedOrder) {
    if (newSelectedOrder !== matchOrderBy) {
      setMatchOrderBy(newSelectedOrder);
      setMatchSortOrder("asc");
      return;
    }
    matchSortOrder === "asc" ? setMatchSortOrder("desc") : setMatchSortOrder("asc");
  }

  const playerTableHeaders = [
    {
      name: "Ime",
      handleOnClick: () => handlePlayerSort(`\"Player\".\"FirstName\"`),
    },
    {
      name: "Prezime",
      handleOnClick: () => handlePlayerSort(`\"Player\".\"LastName\"`),
    },
    { name: "Slika" },
    {
      name: "Datum rođenja",
      handleOnClick: () => handlePlayerSort(`\"Player\".\"DoB\"`),
    },
    {
      name: "Klub",
      handleOnClick: () => handlePlayerSort(`\"Club\".\"Name\"`),
    },
    {
      name: "Nacionalnost",
      handleOnClick: () => handlePlayerSort(`\"Country\".\"Name\"`),
    },
  ];

  const matchTableHeaders = [
    { name: "Vrijeme", handleOnClick: () => handleMatchSort(`\"Match\".\"Time\"`) },
    { name: "Domaćin", handleOnClick: () => handleMatchSort(`clubHome.\"Name\"`) },
    { name: "2Rezultat" },
    { name: "Gost", handleOnClick: () => handleMatchSort(`clubAway.\"Name\"`) },
    {
      name: "Lokacija",
      handleOnClick: () => handleMatchSort(`\"Location\".\"Name\"`),
    },
  ];

  return (
    <div>
      <Navbar />
      <ClubNavbar pageLength={pageLength} onChangePageLength={(e) => setPageLength(e.target.value)} />
      <Table
        skipEditAndDeleteHeaders
        tableHeaders={currentClubTab === "players" ? playerTableHeaders : matchTableHeaders}
        renderData={currentClubTab === "players" ? renderPlayers : renderMatches}
      />
      <ReactPaginate
        previousLabel={<FontAwesomeIcon icon={faArrowLeft} />}
        nextLabel={<FontAwesomeIcon icon={faArrowRight} />}
        pageCount={pageCount}
        onPageChange={changePage}
        forcePage={pageNumber}
        containerClassName={"paginationBttns"}
        previousLinkClassName={"previousBttn"}
        nextLinkClassName={"nextBttn"}
        disabledClassName={"paginationDisabled"}
        activeClassName={"paginationActive"}
      />
    </div>
  );
}
