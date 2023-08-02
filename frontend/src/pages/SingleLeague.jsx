import React, { useEffect, useState } from "react";
import Table from "../components/Table";
import Navbar from "../components/Navbar";
import { getClubsFilteredByLeagueAsync } from "../services/ClubService";
import { useNavigate, useParams } from "react-router-dom";
import LeagueNavbar from "../components/SinglePage/LeagueNavbar";
import { useResultContext } from "../context/ResultContext";
import { getMatchesFilteredByLeagueAndFinishedAsync } from "../services/MatchService";
import { extractDateAndTime } from "../services/DateTimeService";
import ReactPaginate from "react-paginate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";

export default function SingleLeague() {
  const { id } = useParams();
  const { currentLeagueTab } = useResultContext();
  const [clubs, setClubs] = useState([]);
  const [matches, setMatches] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [pageLength, setPageLength] = useState(5);
  const [matchOrderBy, setMatchOrderBy] = useState(`\"Match\".\"Time\"`);
  const [matchSortOrder, setMatchSortOrder] = useState("asc");
  const [clubSortOrder, setClubSortOrder] = useState("asc");
  const [clubOrderBy, setClubOrderBy] = useState(`\"Club\".\"Name\"`);

  const navigate = useNavigate();

  useEffect(() => {
    if (currentLeagueTab === "clubs") {
      fetchClubsAsync();
    }
    else if (currentLeagueTab === "results") {
      fetchMatchesByFinishedAsync(true);
    }
    else if (currentLeagueTab === "schedule") {
      fetchMatchesByFinishedAsync(false);
    }
  }, [currentLeagueTab, pageNumber, pageLength, clubOrderBy, clubSortOrder, matchOrderBy, matchSortOrder]);

  async function fetchClubsAsync() {
    const { items, totalCount } = await getClubsFilteredByLeagueAsync(navigate, pageLength, pageNumber + 1, id, clubOrderBy, clubSortOrder);
    if (items.length === 0 && pageNumber > 0) {
      setPageNumber(pageNumber - 1);
      return;
    }
    setPageCount(Math.ceil(totalCount / pageLength));
    setClubs(items);
  }

  async function fetchMatchesByFinishedAsync(isFinished) {
    const { items, totalCount } = await getMatchesFilteredByLeagueAndFinishedAsync(navigate, pageLength, pageNumber + 1, id, isFinished, matchOrderBy, matchSortOrder);
    if (items.length === 0 && pageNumber > 0) {
      setPageNumber(pageNumber - 1);
      return;
    }
    setPageCount(Math.ceil(totalCount / pageLength));
    setMatches(items);
  }

  function renderClubs() {
    return clubs.map((club) => {
      return (
        <tr key={club.id} onClick={() => navigate(`/single-club/${club.id}`)}>
          <td>{club.name}</td>
          <td>
            <img src={club.logo} className="clublogo" alt="logo" />
          </td>
          <td>{club.league.name}</td>
          <td>{club.location.name}</td>
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

  function handleClubSort(newSelectedOrder) {
    if (newSelectedOrder !== clubOrderBy) {
      setClubOrderBy(newSelectedOrder);
      setClubSortOrder("asc");
      return;
    }
    clubSortOrder === "asc" ? setClubSortOrder("desc") : setClubSortOrder("asc");
  }

  function handleMatchSort(newSelectedOrder) {
    if (newSelectedOrder !== matchOrderBy) {
      setMatchOrderBy(newSelectedOrder);
      setMatchSortOrder("asc");
      return;
    }
    matchSortOrder === "asc" ? setMatchSortOrder("desc") : setMatchSortOrder("asc");
  }

  const clubTableHeaders = [
    { name: "Ime", handleOnClick: () => handleClubSort(`\"Club\".\"Name\"`) },
    { name: "Logo" },
    { name: "Liga", handleOnClick: () => handleClubSort(`\"League\".\"Name\"`) },
    {
      name: "Lokacija",
      handleOnClick: () => handleClubSort(`\"Location\".\"Name\"`),
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
      <LeagueNavbar pageLength={pageLength} onChangePageLength={(e) => setPageLength(e.target.value)} />
      <Table
        skipEditAndDeleteHeaders
        tableHeaders={currentLeagueTab === "clubs" ? clubTableHeaders : matchTableHeaders}
        renderData={currentLeagueTab === "clubs" ? renderClubs : renderMatches}
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
