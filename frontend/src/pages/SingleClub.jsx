import React, { useEffect, useState } from "react";
import Table from "../components/Table";
import Navbar from "../components/Navbar";
import { getPlayersFilteredByClubAsync } from "../services/PlayerService";
import { getClubByIdAsync } from "../services/ClubService";
import { useNavigate, useParams } from "react-router-dom";
import ClubNavbar from "../components/SinglePage/ClubNavbar";
import { useResultContext } from "../context/ResultContext";
import { getMatchesFilteredByClubAndFinishedAsync } from "../services/MatchService";
import { extractDateAndTime } from "../services/DateTimeService";
import Pagination from "../components/Pagination";

export default function SingleClub() {
  const { id } = useParams();
  const { currentClubTab, lang } = useResultContext();
  const [players, setPlayers] = useState([]);
  const [matches, setMatches] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [pageLength, setPageLength] = useState(5);
  const [matchOrderBy, setMatchOrderBy] = useState(`\"Match\".\"Time\"`);
  const [matchSortOrder, setMatchSortOrder] = useState("asc");
  const [playerSortOrder, setPlayerSortOrder] = useState("asc");
  const [playerOrderBy, setPlayerOrderBy] = useState(`\"Player\".\"LastName\"`);
  const [selectedClub, setSelectedClub] = useState({});
  const langParsed = JSON.parse(lang);

  const navigate = useNavigate();

  useEffect(() => {
    fetchClubAsync();
    if (currentClubTab === "players") {
      fetchPlayersAsync();
    } else if (currentClubTab === "results") {
      fetchMatchesByFinishedAsync(true);
    } else if (currentClubTab === "schedule") {
      fetchMatchesByFinishedAsync(false);
    }
  }, [
    currentClubTab,
    pageNumber,
    pageLength,
    playerOrderBy,
    playerSortOrder,
    matchOrderBy,
    matchSortOrder,
  ]);

  async function fetchClubAsync() {
    const club = await getClubByIdAsync(id, navigate);
    setSelectedClub(club);
  }


  async function fetchPlayersAsync() {
    const { items, totalCount } = await getPlayersFilteredByClubAsync(
      navigate,
      pageLength,
      pageNumber + 1,
      id,
      playerOrderBy,
      playerSortOrder
    );
    if (items.length === 0 && pageNumber > 0) {
      setPageNumber(pageNumber - 1);
      return;
    }
    setPageCount(Math.ceil(totalCount / pageLength));
    setPlayers(items);
  }

  async function fetchMatchesByFinishedAsync(isFinished) {
    const { items, totalCount } =
      await getMatchesFilteredByClubAndFinishedAsync(
        navigate,
        pageLength,
        pageNumber + 1,
        id,
        isFinished,
        matchOrderBy,
        matchSortOrder
      );
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
        <tr
          className="cursor-pointer"
          key={match.id}
          onClick={() => navigate(`/single-match/${match.id}`)}
        >
          <td>{extractDateAndTime(match.time)}</td>
          <td>{match.clubHome.name}</td>
          {currentClubTab === "results" ? (<td>{match.homeScore}</td>) : null}
          {currentClubTab === "results" ? (<td>{match.awayScore}</td>) : null}
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
    playerSortOrder === "asc"
      ? setPlayerSortOrder("desc")
      : setPlayerSortOrder("asc");
  }

  function handleMatchSort(newSelectedOrder) {
    if (newSelectedOrder !== matchOrderBy) {
      setMatchOrderBy(newSelectedOrder);
      setMatchSortOrder("asc");
      return;
    }
    matchSortOrder === "asc"
      ? setMatchSortOrder("desc")
      : setMatchSortOrder("asc");
  }

  const playerTableHeaders = [
    {
      name: langParsed.strFirstName,
      handleOnClick: () => handlePlayerSort(`\"Player\".\"FirstName\"`),
    },
    {
      name: langParsed.strLastName,
      handleOnClick: () => handlePlayerSort(`\"Player\".\"LastName\"`),
    },
    { name: langParsed.strImage },
    {
      name: langParsed.strBirthDate,
      handleOnClick: () => handlePlayerSort(`\"Player\".\"DoB\"`),
    },
    {
      name: langParsed.strClub,
      handleOnClick: () => handlePlayerSort(`\"Club\".\"Name\"`),
    },
    {
      name: langParsed.strNationality,
      handleOnClick: () => handlePlayerSort(`\"Country\".\"Name\"`),
    },
  ];

  const matchTableHeaders = [
    {
      name: langParsed.strTime,
      handleOnClick: () => handleMatchSort(`\"Match\".\"Time\"`),
    },
    {
      name: langParsed.strHome,
      handleOnClick: () => handleMatchSort(`clubHome.\"Name\"`),
    },
    {
      name: langParsed.strAway,
      handleOnClick: () => handleMatchSort(`clubAway.\"Name\"`),
    },
    {
      name: langParsed.strLocation,
      handleOnClick: () => handleMatchSort(`\"Location\".\"Name\"`),
    },
  ];

  if (currentClubTab === "results") {
    matchTableHeaders.splice(2, 0, { name: langParsed.strScore });
  }

  return (
    <div>
      <Navbar />
      <div className="single-title d-flex justify-content-center align-items-center mt-4">
        <img className="titlelogo mx-3" src={selectedClub.logo} alt="logo" />
        <h1>{selectedClub.name}</h1>
      </div>
      <ClubNavbar
        pageLength={pageLength}
        onChangePageLength={(e) => setPageLength(e.target.value)}
      />
      <Table
        skipEditAndDeleteHeaders
        tableHeaders={
          currentClubTab === "players" ? playerTableHeaders : matchTableHeaders
        }
        renderData={
          currentClubTab === "players" ? renderPlayers : renderMatches
        }
      />
      <Pagination pageCount={pageCount} changePage={changePage} pageNumber={pageNumber} />
    </div>
  );
}
