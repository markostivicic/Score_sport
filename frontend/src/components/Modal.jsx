import React from "react";

export default function Modal({
  selectedItem,
  handleCancelDelete,
  handleConfirmDelete,
}) {
  if (!selectedItem) return null;

  return (
    <div className="modal" tabIndex="-1" role="dialog">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-body">
            <p>Jeste li sigurni da želite obrisati {selectedItem.name}?</p>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleCancelDelete}
            >
              Ne
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={handleConfirmDelete}
            >
              Da
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
