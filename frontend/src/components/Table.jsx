import { faSort } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useResultContext } from "../context/ResultContext";

export default function Table({
  tableHeaders,
  renderData,
  skipEditAndDeleteHeaders,
  children,
  isActive,
}) {
  const { lang } = useResultContext();

  const langParsed = JSON.parse(lang);
  return (
    <div className="container">
      <div className="table-responsive">
        <table className="table table-hover">
          <thead>
            <tr >
              {tableHeaders.map((header) => {
                const colSpan = parseInt(header.name.substring(0, 1)) || 1;
                const headerText =
                  colSpan !== 1 ? header.name.substring(1) : header.name;
                return (
                  <th
                    className="cursor-pointer"
                    key={header.name}
                    onClick={header.handleOnClick}
                    colSpan={colSpan}
                  >
                    {headerText}{" "}
                    {header.handleOnClick ? (
                      <FontAwesomeIcon
                        className="text-white"
                        icon={faSort}
                      />
                    ) : (
                      ""
                    )}
                  </th>
                );
              })}
              {skipEditAndDeleteHeaders || (isActive ? <th>{langParsed.strChange}</th> : null)}
              {skipEditAndDeleteHeaders || (
                <th> {isActive ? langParsed.strDelete : langParsed.strReturn}</th>
              )}
            </tr>
          </thead>
          <tbody>{renderData()}</tbody>
        </table>
      </div>
      {children}
    </div>
  );
}
