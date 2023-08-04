import React from "react";
import DashboardNav from "./DashboardNav/DashboardNav";

export default function Background({ children }) {
  return (
    <>
      <div className="d-flex flex-column w-100 h-100">{children}</div>
      <DashboardNav />
    </>
  );
}
