import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import API from "../../services/AxiosService";
import {
  getHeaders,
  redirectToLoginIfNeeded,
} from "../../services/AuthService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { v4 as uuid } from "uuid";
import { useResultContext } from "../../context/ResultContext";
import ControlledInput from "../ControlledInput";

export default function SportNavbar() {
  const [sports, setSports] = useState([]);
  const { currentSport, setCurrentSport, selectedDate, setSelectedDate } =
    useResultContext();

  const navigate = useNavigate();

  useEffect(() => {
    async function getClubs() {
      try {
        const response = await API.get("/sport?pageSize=100&pageNumber=0", {
          headers: getHeaders(),
        });
        const sportsFromDatabase = response.data.items;
        setSports(sportsFromDatabase);
        sportsFromDatabase.length > 0 && setCurrentSport(sportsFromDatabase[0]);
      } catch (err) {
        redirectToLoginIfNeeded(err, navigate, toast);
      }
    }
    getClubs();
  }, []);

  // id,
  // type,
  // isRequired,
  // labelText,
  // value,
  // onSelectChange,

  return (
    <nav className="navbar navbar-expand-md">
      <div className="container">
        <ul className="navbar-nav">
          {sports?.map((sport) => {
            return (
              <li className="nav-item" key={uuid()}>
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
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
      </div>
    </nav>
  );
}
