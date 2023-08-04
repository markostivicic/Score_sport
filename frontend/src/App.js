import "./App.css"
import { ToastContainer, toast } from "react-toastify"
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom"
import { useEffect } from "react"
import axios from "axios"
import { getHeaders, redirectToLoginIfNeeded } from "./services/AuthService"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Home from "./pages/Home"
import { useResultContext } from "./context/ResultContext"
import Spinner from "./components/Spinner"
import Sport from "./pages/sport/Sport"
import SportCreate from "./pages/sport/SportCreate"
import SportUpdate from "./pages/sport/SportUpdate"
import Match from "./pages/match/Match"
import MatchCreate from "./pages/match/MatchCreate"
import MatchUpdate from "./pages/match/MatchUpdate"
import Country from "./pages/country/Country"
import CountryCreate from "./pages/country/CountryCreate"
import CountryUpdate from "./pages/country/CountryUpdate"
import Location from "./pages/location/Location"
import LocationCreate from "./pages/location/LocationCreate"
import LocationUpdate from "./pages/location/LocationUpdate"
import League from "./pages/league/League"
import LeagueCreate from "./pages/league/LeagueCreate"
import LeagueUpdate from "./pages/league/LeagueUpdate"
import SingleMatch from "./pages/SingleMatch"
import SingleClub from "./pages/SingleClub"
import SingleLeague from "./pages/SingleLeague"

import Club from "./pages/club/Club"
import ClubCreate from "./pages/club/ClubCreate"
import ClubUpdate from "./pages/club/ClubUpdate"
import Player from "./pages/player/Player"
import PlayerCreate from "./pages/player/PlayerCreate"
import PlayerUpdate from "./pages/player/PlayerUpdate"
function App() {
  const navigate = useNavigate()
  const { authenticatedUser, setAuthenticatedUser } = useResultContext()

  const path = useLocation().pathname

  useEffect(() => {
    async function verifyAsync() {
      try {
        const response = await axios.get(
          "https://localhost:44345/api/account/verify",
          {
            headers: getHeaders(),
          }
        )
        setAuthenticatedUser(response.data)
      } catch (err) {
        if (path !== "/login" && path !== "/register")
          redirectToLoginIfNeeded(navigate, err, toast)
      }
    }
    verifyAsync()
  }, [])

  if (!authenticatedUser && path !== "/login" && path !== "/register") {
    return <Spinner />
  }

  function verifyRole(component) {
    if (authenticatedUser?.role === "Admin") {
      return component
    }
    ;<Navigate to={"/"} />
  }

  return (
    <>
      <Routes>
        <Route path="/sport">
          <Route index={true} element={verifyRole(<Sport />)} />
          <Route path="create" element={verifyRole(<SportCreate />)} />
          <Route path="update/:id" element={verifyRole(<SportUpdate />)} />
        </Route>
        <Route path="/club">
          <Route index={true} element={verifyRole(<Club />)} />
          <Route path="/club/create" element={verifyRole(<ClubCreate />)} />
          <Route path="/club/update/:id" element={verifyRole(<ClubUpdate />)} />
        </Route>
        <Route path="/player">
          <Route index={true} element={verifyRole(<Player />)} />
          <Route path="/player/create" element={verifyRole(<PlayerCreate />)} />
          <Route
            path="/player/update/:id"
            element={verifyRole(<PlayerUpdate />)}
          />
        </Route>
        <Route path="/country">
          <Route index={true} element={verifyRole(<Country />)} />
          <Route
            path="/country/create"
            element={verifyRole(<CountryCreate />)}
          />
          <Route
            path="/country/update/:id"
            element={verifyRole(<CountryUpdate />)}
          />
        </Route>
        <Route path="/location">
          <Route index={true} element={verifyRole(<Location />)} />
          <Route
            path="/location/create"
            element={verifyRole(<LocationCreate />)}
          />
          <Route
            path="/location/update/:id"
            element={verifyRole(<LocationUpdate />)}
          />
        </Route>
        <Route path="/league">
          <Route index={true} element={verifyRole(<League />)} />
          <Route path="/league/create" element={verifyRole(<LeagueCreate />)} />
          <Route
            path="/league/update/:id"
            element={verifyRole(<LeagueUpdate />)}
          />
        </Route>
        <Route path="/match">
          <Route index={true} element={verifyRole(<Match />)} />
          <Route path="/match/create" element={verifyRole(<MatchCreate />)} />
          <Route
            path="/match/update/:id"
            element={verifyRole(<MatchUpdate />)}
          />
        </Route>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/single-match/:id" element={<SingleMatch />} />
        <Route path="/single-club/:id" element={<SingleClub />} />
        <Route path="/single-league/:id" element={<SingleLeague />} />
        <Route path="*" element={<Navigate to={"/"} />} />
      </Routes>
      <ToastContainer />
    </>
  )
}

export default App
