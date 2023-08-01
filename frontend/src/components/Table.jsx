import React from "react";

export default function Table({
  tableHeaders,
  renderData,
  skipEditAndDeleteHeaders,
  children, 
  isActive,
}) {
  return (
    <>
      <div className="table-responsive">
        <table className="table table-hover">
          <thead>
            <tr>
              {tableHeaders.map((header) => {
                const colSpan = parseInt(header.substring(0, 1)) || 1;
                const headerText = colSpan !== 1 ? header.substring(1) : header;
                return (
                  <th key={header} colSpan={colSpan}>
                    {headerText}
                  </th>
                );
              })}
              {skipEditAndDeleteHeaders || {isActive ? <th>Izmijeni</th> : null}}
              {skipEditAndDeleteHeaders || <th>{isActive ? "Izbriši" : "Vrati"}</th>
            </tr>
          </thead>
          <tbody>{renderData()}</tbody>
        </table>
      </div>
      {children}
    </>
  );
}
