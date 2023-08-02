import React, { useEffect, useState } from "react";
import { getClubsWithFiltersAsync } from "../../services/ClubService";
import { getLeaguesWithFiltersAsync } from "../../services/LeagueService";
import { useNavigate } from "react-router-dom";

export default function SearchModal({ handleBackButton }) {
  const [searchFilter, setSearchFilter] = useState();
  const [clubs, setClubs] = useState([]);
  const [leagues, setLeagues] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchClubsAsync();
    fetchLeaguesAsync();
  }, [searchFilter]);

  async function fetchClubsAsync() {
    const { items } = await getClubsWithFiltersAsync(navigate, 5, 1, searchFilter);
    setClubs(items);
  }

  async function fetchLeaguesAsync() {
    const { items } = await getLeaguesWithFiltersAsync(navigate, 5, 1, searchFilter);
    setLeagues(items);
  }

  function renderData() { }

  return (
    <div className="modal" tabIndex="-1" role="dialog">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-body">
            <input
              id="searchFilter"
              type="text"
              placeholder="Pretraži klubove i lige"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="form-control" />
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleBackButton}>
              Natrag
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
