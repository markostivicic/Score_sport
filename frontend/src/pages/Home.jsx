import React from "react";
import Navbar from "../components/Navbar";
import SportNavbar from "../components/Home/SportNavbar";
import Leagues from "../components/Home/Leagues";
import SearchModal from "../components/Home/SearchModal";

export default function Home() {
  function handleBackButton() {

  }

  return (
    <div>
      <SearchModal handleBackButton={handleBackButton} />
      <Navbar />
      <SportNavbar />
      <Leagues />
    </div>
  );
}
