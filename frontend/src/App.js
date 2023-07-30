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
import SingleMatch from "./pages/SingleMatch";

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
