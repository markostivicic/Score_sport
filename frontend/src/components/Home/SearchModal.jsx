import React, { useEffect, useState } from "react";
import { getClubsWithSearchFilterAsync } from "../../services/ClubService";
import { getLeaguesWithSearchFilterAsync } from "../../services/LeagueService";
import { useNavigate } from "react-router-dom";
import { useResultContext } from "../../context/ResultContext";

export default function SearchModal({ isSearchModalOpen, hideSearchModal }) {
  const [searchFilter, setSearchFilter] = useState("");
  const [clubs, setClubs] = useState([]);
  const [leagues, setLeagues] = useState([]);
  const { lang } = useResultContext();

  const langParsed = JSON.parse(lang);

  const navigate = useNavigate();

  useEffect(() => {
    fetchClubsAsync();
    fetchLeaguesAsync();
  }, [searchFilter]);

  if (!isSearchModalOpen) return null;

  async function fetchClubsAsync() {
    const { items } = await getClubsWithSearchFilterAsync(navigate, 3, 1, searchFilter);
    setClubs(items);
  }

  async function fetchLeaguesAsync() {
    const { items } = await getLeaguesWithSearchFilterAsync(navigate, 3, 1, searchFilter);
    setLeagues(items);
  }

  function renderData() {
    if (searchFilter === "") {
      return (
        <div>
          <p>{langParsed.strSearchPlaceholder}</p>
        </div>
      );
    }

    else if (clubs.length === 0 && leagues.length === 0) {
      return (
        <div>
          <p>{langParsed.strNoResults}</p>
        </div>
      );
    }

    return (
      <div>
        <h4>{langParsed.strClubs}</h4>
        {clubs.length !== 0 ? (<ul className="list-group">
          {clubs.map((club) => (
            <li
              key={club.id}
              className="list-group-item cursor-pointer li-hover"
              onClick={() => navigate(`/single-club/${club.id}`)}>
              {club.name}
            </li>
          ))}
        </ul>) : <p>{langParsed.strNoClubs}</p>}
        <hr />

        <h4>{langParsed.strLeagues}</h4>
        {leagues.length !== 0 ? (<ul className="list-group">
          {leagues.map((league) => (
            <li
              key={league.id}
              className="list-group-item cursor-pointer li-hover"
              onClick={() => navigate(`/single-league/${league.id}`)}>
              {league.name}
            </li>
          ))}
        </ul>) : <p>{langParsed.strNoLeagues}</p>}
      </div>
    );
  }

  return (
    <div className="modal" tabIndex="-1" role="dialog">
      <div className="modal-dialog modal-dialog-centered overflow-auto" role="document">
        <div className="modal-content h-600">
          <h2 className="align-self-center mt-3">{langParsed.strSearchWithoutSemicolon}</h2>
          <div className="modal-body">
            <input
              id="searchFilter"
              type="text"
              placeholder={langParsed.strSearchClubsAndLeagues}
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="form-control my-4" />
            {renderData()}
          </div>
          <div className="modal-footer d-flex justify-content-center">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => { setSearchFilter(""); hideSearchModal() }}>
              {langParsed.strBack}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
