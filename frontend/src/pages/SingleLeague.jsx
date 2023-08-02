import React, { useEffect, useState } from "react";
import Table from "../components/Table";
import Navbar from "../components/Navbar";
import { getClubsAsync } from "../services/ClubService";
import { useNavigate } from "react-router-dom";

export default function SingleLeague() {
  const [clubs, setClubs] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchClubsAsync() {
      const { items } = await getClubsAsync(navigate, 100, 0);
      setClubs(items);
    }
    fetchClubsAsync();
  }, []);

  function renderData() {
    return clubs.map((club) => {
      return (
        <tr key={club.id}>
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

  return (
    <div>
      <Navbar />
      <Table
        skipEditAndDeleteHeaders
        tableHeaders={["Ime", "Logo", "Liga", "Lokacija"]}
        renderData={renderData}
      />
    </div>
  );
}
