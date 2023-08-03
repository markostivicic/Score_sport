import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { getSportsAsync } from "../../services/SportService";
import { useNavigate } from "react-router-dom";
import { useResultContext } from "../../context/ResultContext";
import ControlledInput from "../ControlledInput";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

export default function SportNavbar({ showSearchModal }) {
  const [sports, setSports] = useState([{ id: "unique", name: "Favoriti" }]);
  const { currentSport, setCurrentSport, selectedDate, setSelectedDate, lang } =
    useResultContext();
  const langParsed = JSON.parse(lang);
  const navigate = useNavigate();

  useEffect(() => { }, []);

  useEffect(() => {
    async function getAllSportsAsync() {
      const { items } = await getSportsAsync(navigate, 100, 0);
      setSports([{ id: "unique", name: langParsed.strFavourites }, ...items]);
    }
    getAllSportsAsync();
  }, [lang]);

  return (
    <nav className="navbar navbar-expand-md">
      <div className="container">
        <ul className="navbar-nav">
          <li className="nav-item">
            <span
              onClick={showSearchModal}
              className={`nav-link cursor-pointer`}
            >
              <FontAwesomeIcon icon={faSearch} />
            </span>
          </li>
          {sports?.map((sport) => {
            return (
              <li className="nav-item" key={sport.id}>
                <span
                  onClick={() => setCurrentSport(sport)}
                  className={`nav-link cursor-pointer ${currentSport?.id === sport.id && "active background-shade"
                    }`}
                >
                  {sport.name}
                </span>
              </li>
            );
          })}
        </ul>
        <div className="ms-auto">
          <ControlledInput
            id="calendar"
            type="date"
            isRequired={false}
            value={selectedDate}
            onChange={(e) => {
              setSelectedDate(e.target.value);
            }}
          />
        </div>
      </div>
    </nav>
  );
}
