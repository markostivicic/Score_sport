import "./App.css";
import { ToastContainer, toast } from "react-toastify";
import { Routes, Route } from "react-router-dom";
import Sport from "./pages/sport/Sport";
import SportCreate from "./pages/sport/SportCreate";
import SportUpdate from "./pages/sport/SportUpdate";

function App() {
  return (
    <>
      <Routes>
        <Route path="/sport" element={<Sport />} />
        <Route path="/sport/create" element={<SportCreate />} />
        <Route path="/sport/update/:id" element={<SportUpdate />} />
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;
