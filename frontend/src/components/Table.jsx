import React from "react";

export default function Table({ tableHeaders, renderData, children }) {
  return (
    <>
      <div className="table-responsive">
        <table className="table table-hover">
          <thead>
            <tr>
              {tableHeaders.map((header) => {
                return <th key={header}>{header}</th>;
              })}
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>{renderData()}</tbody>
        </table>
      </div>
      {children}
    </>
  );
}
