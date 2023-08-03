import React, { useEffect, useState } from "react";
import Table from "../components/Table";
import Navbar from "../components/Navbar";
import { getClubsFilteredByLeagueAsync } from "../services/ClubService";
import { getLeagueByIdAsync } from "../services/LeagueService";
import { useNavigate, useParams } from "react-router-dom";
import LeagueNavbar from "../components/SinglePage/LeagueNavbar";
import { useResultContext } from "../context/ResultContext";
import { getMatchesFilteredByLeagueAndFinishedAsync } from "../services/MatchService";
import { extractDateAndTime } from "../services/DateTimeService";
import Pagination from "../components/Pagination";

export default function SingleLeague() {
  const { id } = useParams();
  const { currentLeagueTab, lang } = useResultContext();
  const [clubs, setClubs] = useState([]);
  const [matches, setMatches] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [pageLength, setPageLength] = useState(5);
  const [matchOrderBy, setMatchOrderBy] = useState(`\"Match\".\"Time\"`);
  const [matchSortOrder, setMatchSortOrder] = useState("asc");
  const [clubSortOrder, setClubSortOrder] = useState("asc");
  const [clubOrderBy, setClubOrderBy] = useState(`\"Club\".\"Name\"`);
  const [selectedLeague, setSelectedLeague] = useState({});
  const langParsed = JSON.parse(lang);
  const navigate = useNavigate();

  useEffect(() => {
    fetchClubAsync();
    if (currentLeagueTab === "clubs") {
      fetchClubsAsync();
    } else if (currentLeagueTab === "results") {
      fetchMatchesByFinishedAsync(true);
    } else if (currentLeagueTab === "schedule") {
      fetchMatchesByFinishedAsync(false);
    }
  }, [
    currentLeagueTab,
    pageNumber,
    pageLength,
    clubOrderBy,
    clubSortOrder,
    matchOrderBy,
    matchSortOrder,
  ]);

  async function fetchClubAsync() {
    const league = await getLeagueByIdAsync(id, navigate);
    setSelectedLeague(league);
  }

  async function fetchClubsAsync() {
    const { items, totalCount } = await getClubsFilteredByLeagueAsync(
      navigate,
      pageLength,
      pageNumber + 1,
      id,
      clubOrderBy,
      clubSortOrder
    );
    if (items.length === 0 && pageNumber > 0) {
      setPageNumber(pageNumber - 1);
      return;
    }
    setPageCount(Math.ceil(totalCount / pageLength));
    setClubs(items);
  }

  async function fetchMatchesByFinishedAsync(isFinished) {
    const { items, totalCount } =
      await getMatchesFilteredByLeagueAndFinishedAsync(
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

  function renderClubs() {
    return clubs.map((club) => {
      return (
        <tr
          className="cursor-pointer"
          key={club.id}
          onClick={() => navigate(`/single-club/${club.id}`)}
        >
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
        <tr
          className="cursor-pointer"
          key={match.id}
          onClick={() => navigate(`/single-match/${match.id}`)}
        >
          <td>{extractDateAndTime(match.time)}</td>
          <td>{match.clubHome.name}</td>
          {currentLeagueTab === "results" ? (<td>{match.homeScore}</td>) : null}
          {currentLeagueTab === "results" ? (<td>{match.awayScore}</td>) : null}
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
    clubSortOrder === "asc"
      ? setClubSortOrder("desc")
      : setClubSortOrder("asc");
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

  const clubTableHeaders = [
    { name: langParsed.strName, handleOnClick: () => handleClubSort(`\"Club\".\"Name\"`) },
    { name: langParsed.strLogo },
    {
      name: langParsed.strLeague,
      handleOnClick: () => handleClubSort(`\"League\".\"Name\"`),
    },
    {
      name: langParsed.strLocation,
      handleOnClick: () => handleClubSort(`\"Location\".\"Name\"`),
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

  if (currentLeagueTab === "results") {
    matchTableHeaders.splice(2, 0, { name: langParsed.strScore });
  }

  return (
    <div>
      <Navbar />
      <div className="single-title d-flex justify-content-center align-items-center mt-4">
        <h1>{selectedLeague.name}</h1>
      </div>
      <LeagueNavbar
        pageLength={pageLength}
        onChangePageLength={(e) => setPageLength(e.target.value)}
      />
      <Table
        skipEditAndDeleteHeaders
        tableHeaders={
          currentLeagueTab === "clubs" ? clubTableHeaders : matchTableHeaders
        }
        renderData={currentLeagueTab === "clubs" ? renderClubs : renderMatches}
      />
      <Pagination pageCount={pageCount} changePage={changePage} pageNumber={pageNumber} />
    </div>
  );
}
