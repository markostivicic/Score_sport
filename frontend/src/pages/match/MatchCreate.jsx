import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import API from "../../services/AxiosService";
import { toast } from "react-toastify";
import { getHeaders } from "../../services/AuthService";
import { useNavigate } from "react-router-dom";
import MatchCreateForm from "../../components/MatchCreateForm"

export default function MatchCreate() {
  const navigate = useNavigate()

  async function createMatchAsync(e) {
    e.preventDefault();

    const matchTime = e.target.elements.matchTime.value;
    const matchClubHome = e.target.elements.matchClubHome.value;
    const matchClubAway = e.target.elements.matchClubAway.value;
    const matchLocation = e.target.elements.matchLocation.value;
    const matchToUpdate = {
      time: matchTime,
      clubHomeId: matchClubHome,
      clubAwayId: matchClubAway,
      locationId: matchLocation,
    };

    try {
      await API.post(`/match`, matchToUpdate, {
        headers: getHeaders(),
      }).then(() => {
        toast.success("Utakmica kreirana");
        navigate("/match");
      });
    } catch (e) {
      toast.error("Utakmica nije kreirana");
      console.log(e);
    }
  }

  return (
    <div>
      <Navbar />
      <MatchCreateForm onSubmit={createMatchAsync} />
    </div>
  )
}
