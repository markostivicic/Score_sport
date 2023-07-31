import "./App.css";
import { ToastContainer, toast } from "react-toastify";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import { getHeaders, redirectToLoginIfNeeded } from "./services/AuthService";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import { useResultContext } from "./context/ResultContext";
import Spinner from "./components/Spinner";
import Sport from "./pages/sport/Sport";
import SportCreate from "./pages/sport/SportCreate";
import SportUpdate from "./pages/sport/SportUpdate";
import Country from "./pages/country/Country";
import CountryCreate from "./pages/country/CountryCreate";
import CountryUpdate from "./pages/country/CountryUpdate";
import Location from "./pages/location/Location";
import LocationCreate from "./pages/location/LocationCreate";
import LocationUpdate from "./pages/location/LocationUpdate";
import League from "./pages/league/League";
import LeagueCreate from "./pages/league/LeagueCreate";
import LeagueUpdate from "./pages/league/LeagueUpdate";
import SingleMatch from "./pages/SingleMatch";

import Club from "./pages/club/Club";
import ClubCreate from "./pages/club/ClubCreate";
import ClubUpdate from "./pages/club/ClubUpdate";
import Player from "./pages/player/Player";
import PlayerCreate from "./pages/player/PlayerCreate";
import PlayerUpdate from "./pages/player/PlayerUpdate";
function App() {
  const navigate = useNavigate();
  const { authenticatedUser, setAuthenticatedUser } = useResultContext();

  const path = useLocation().pathname;

  useEffect(() => {
    async function verifyAsync() {
      try {
        const response = await axios.get(
          "https://localhost:44345/api/account/verify",
          {
            headers: getHeaders(),
          }
        );
        setAuthenticatedUser(response.data);
      } catch (err) {
        if (path !== "/login" && path !== "/register")
          redirectToLoginIfNeeded(navigate, err, toast);
      }
    }
    verifyAsync();
  }, []);

  if (!authenticatedUser && path !== "/login" && path !== "/register") {
    return <Spinner />;
  }

  return (
    <>
      <Routes>
        <Route path="/sport" element={<Sport />} />
        <Route path="/sport/create" element={<SportCreate />} />
        <Route path="/sport/update/:id" element={<SportUpdate />} />
        <Route path="/club" element={<Club />} />
        <Route path="/club/create" element={<ClubCreate />} />
        <Route path="/club/update/:id" element={<ClubUpdate />} />
        <Route path="/player" element={<Player />} />
        <Route path="/player/create" element={<PlayerCreate />} />
        <Route path="/player/update/:id" element={<PlayerUpdate />} />
        <Route path="/country" element={<Country />} />
        <Route path="/country/create" element={<CountryCreate />} />
        <Route path="/country/update/:id" element={<CountryUpdate />} />
        <Route path="/location" element={<Location />} />
        <Route path="/location/create" element={<LocationCreate />} />
        <Route path="/location/update/:id" element={<LocationUpdate />} />
        <Route path="/league" element={<League />} />
        <Route path="/league/create" element={<LeagueCreate />} />
        <Route path="/league/update/:id" element={<LeagueUpdate />} />
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/single-match/:id" element={<SingleMatch />} />
        <Route path="*" element={<Navigate to={"/"} />} />
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;
