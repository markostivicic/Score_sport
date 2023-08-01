import React from "react";
import styles from "./dashboard.module.css";
import { useResultContext } from "../../context/ResultContext";
import { Link, useMatch, useResolvedPath } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function DashboardNavItem({ icon, text, path }) {
  return <CustomLink to={path} icon={icon} text={text} />;
}

function CustomLink({ to, icon, text }) {
  const { setIsSideNavActive } = useResultContext();
  const resolvedPath = useResolvedPath(to);
  const isActive = useMatch({ path: resolvedPath.pathname, end: true });
  return (
    <Link
      to={to}
      className={`${styles.linkk} ${
        isActive ? styles.textgreen : styles.textgray
      } `}
      onClick={() => setIsSideNavActive(false)}
    >
      <div className={styles.iconcontainer}>
        <FontAwesomeIcon icon={icon} />
      </div>
      <span>{text}</span>
    </Link>
  );
}
