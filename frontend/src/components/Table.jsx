import React from "react";
import { v4 as uuid } from "uuid";

export default function Table({ tableHeaders, renderData }) {
  return (
    <div className="table-responsive">
      <table className="table table-hover">
        <thead>
          <tr>
            {tableHeaders.map((header) => {
              return <th key={uuid()}>{header}</th>;
            })}
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>{renderData()}</tbody>
      </table>
    </div>
  );
}
