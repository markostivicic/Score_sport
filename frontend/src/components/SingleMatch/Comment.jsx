import React from "react";
import { useResultContext } from "../../context/ResultContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import {
  extractHoursAndMinutes,
  extractDate,
} from "../../services/DateTimeService";

export default function Comment({ comment, setSelectedCommentId }) {
  const { authenticatedUser } = useResultContext();

  return (
    <div className="d-flex align-items-center gap-3">
      <div className="max-width">
        <strong>{comment.user.userName}</strong>
        <span className="mx-3">
          {extractDate(comment.time)} {extractHoursAndMinutes(comment.time)}
        </span>
        <p className="white-space-initial">{comment.text}</p>
      </div>
      {authenticatedUser?.username === comment.user.userName && (
        <FontAwesomeIcon
          className="text-danger min-width-10 cursor-pointer"
          icon={faTrash}
          onClick={() => setSelectedCommentId(comment.id)}
        />
      )}
    </div>
  );
}
