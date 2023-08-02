import React, { useState } from "react";
import Navbar from "../components/Navbar";
import SportNavbar from "../components/Home/SportNavbar";
import Leagues from "../components/Home/Leagues";
import SearchModal from "../components/Home/SearchModal";

export default function Home() {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  function hideSearchModal() {
    setIsSearchModalOpen(false);
  }

  function showSearchModal() {
    setIsSearchModalOpen(true);
  }

  return (
    <div>
      <SearchModal isSearchModalOpen={isSearchModalOpen} hideSearchModal={hideSearchModal} />
      <Navbar />
      <SportNavbar showSearchModal={showSearchModal} />
      <Leagues />
    </div>
  );
}
