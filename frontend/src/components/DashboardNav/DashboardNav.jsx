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
        <DashboardNavItem icon={faVolleyball} text="SPORT" path="/sport" />
        <DashboardNavItem icon={faMedal} text="KLUB" path="/club" />
        <DashboardNavItem icon={faShirt} text="IGRAČ" path="/player" />
        <DashboardNavItem
          icon={faEarthAmericas}
          text="DRŽAVA"
          path="/country"
        />
        <DashboardNavItem
          icon={faLocationDot}
          text="LOKACIJA"
          path="/location"
        />
        <DashboardNavItem icon={faTrophy} text="LIGA" path="/league" />
        <DashboardNavItem icon={faPeopleArrows} text="UTAKMICA" path="/match" />
      </div>
    </div>
  );
}
