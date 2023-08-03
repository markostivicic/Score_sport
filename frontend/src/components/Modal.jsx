import React from "react";
import { useResultContext } from "../context/ResultContext";

export default function Modal({
  selectedItem,
  handleCancelDelete,
  handleConfirmDelete,
  isComment,
  activeFilter,
}) {
  const { lang } = useResultContext();
  if (!selectedItem) return null;

  const langParsed = JSON.parse(lang);
  return (
    <div className="modal" tabIndex="-1" role="dialog">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-body">
            <p>
              {isComment
                ? langParsed.strCommentDeleteConfirmation
                : `${langParsed.strDeleteConfirmation} ${
                    activeFilter
                      ? langParsed.strDeleting
                      : langParsed.strReturning
                  } ${selectedItem.name}?`}
            </p>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleCancelDelete}
            >
              {langParsed.strNo}
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={handleConfirmDelete}
            >
              {langParsed.strYes}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
