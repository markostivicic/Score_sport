import React from "react";
import { useResultContext } from "../../context/ResultContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

export default function Comment({ comment }) {
  const { authenticatedUser } = useResultContext();

  function handleOnClickDelete() {}

  return (
    <div className="d-flex align-items-center gap-3">
      <div className="max-width">
        <strong>{comment.user.userName}</strong>
        <p className="white-space-initial">{comment.text}</p>
      </div>
      {authenticatedUser?.username === comment.user.userName && (
        <FontAwesomeIcon
          className="text-danger min-width-10 cursor-pointer"
          icon={faTrash}
          onClick={handleOnClickDelete}
        />
      )}
    </div>
  );
}
