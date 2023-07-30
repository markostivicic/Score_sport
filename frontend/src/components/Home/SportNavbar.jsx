import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { getSportsAsync } from "../../services/SportService";
import { useNavigate } from "react-router-dom";
import { useResultContext } from "../../context/ResultContext";
import ControlledInput from "../ControlledInput";

export default function SportNavbar() {
  const [sports, setSports] = useState([]);
  const { currentSport, setCurrentSport, selectedDate, setSelectedDate } =
    useResultContext();

  const navigate = useNavigate();

  useEffect(() => {
    async function getAllSportsAsync() {
      const { items } = await getSportsAsync(navigate, 100, 0);
      setSports(items);
      items.length > 0 && setCurrentSport(items[0]);
    }
    getAllSportsAsync();
  }, []);

  return (
    <nav className="navbar navbar-expand-md">
      <div className="container">
        <ul className="navbar-nav">
          {sports?.map((sport) => {
            return (
              <li className="nav-item" key={sport.id}>
                <span
                  onClick={() => setCurrentSport(sport)}
                  className={`nav-link cursor-pointer ${
                    currentSport?.id === sport.id && "active"
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
