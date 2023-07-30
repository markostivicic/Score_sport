import React from "react";
import Navbar from "../components/Navbar";
import SportNavbar from "../components/Home/SportNavbar";
import Leagues from "../components/Home/Leagues";

export default function Home() {
  return (
    <div>
      <Navbar />
      <SportNavbar />
      <Leagues />
    </div>
  );
}
