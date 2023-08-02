import React from "react";
import styles from "./dashboard.module.css";
import {
  faCircleXmark,
  faEarthAmericas,
  faLocationDot,
  faMedal,
  faPeopleArrows,
  faShirt,
  faTrophy,
  faVolleyball,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useResultContext } from "../../context/ResultContext";
import DashboardNavItem from "./DashboardNavItem";

export default function DashboardNav() {
  const { isSideNavActive, setIsSideNavActive } = useResultContext();
  const { lang } = useResultContext();

  const langParsed = JSON.parse(lang);

  return (
    <div
      className={`${styles.sidenav} ${
        isSideNavActive ? styles.navwidth : styles.widthzero
      }`}
    >
      <div className={styles.maincontainer}>
        <div className={styles.titlecontainer}>
          <img
            className="small-logo"
            src={require("../../assets/logo.png")}
            alt="logo"
          />
          <FontAwesomeIcon
            icon={faCircleXmark}
            className={styles.xmark}
            onClick={() => setIsSideNavActive(false)}
          />
        </div>
        <DashboardNavItem
          class="text-uppercase"
          icon={faVolleyball}
          text={langParsed.strSport}
          path="/sport"
        />
        <DashboardNavItem
          class="text-uppercase"
          icon={faMedal}
          text={langParsed.strClub}
          path="/club"
        />
        <DashboardNavItem
          class="text-uppercase"
          icon={faShirt}
          text={langParsed.strPlayer}
          path="/player"
        />
        <DashboardNavItem
          class="text-uppercase"
          icon={faEarthAmericas}
          text={langParsed.strCountry}
          path="/country"
        />
        <DashboardNavItem
          class="text-uppercase"
          icon={faLocationDot}
          text={langParsed.strLocation}
          path="/location"
        />
        <DashboardNavItem
          icon={faTrophy}
          text={langParsed.strLeague}
          path="/league"
        />
        <DashboardNavItem
          icon={faPeopleArrows}
          text={langParsed.strMatch}
          path="/match"
        />
      </div>
    </div>
  );
}
