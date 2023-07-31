import React, { useEffect, useState } from "react";
import Button from "../Button";
import Form from "../Form";
import {
  createNewCommentAsync,
  getCommentsAsync,
} from "../../services/CommentService";
import { useNavigate } from "react-router-dom";
import Comment from "./Comment";

export default function CommentSection({ matchId }) {
  const [isFormActive, setIsFormActive] = useState(false);
  const [comments, setComments] = useState([]);

  const navigate = useNavigate();

  async function getAllCommentsAsync() {
    const commentsFromDatabase = await getCommentsAsync(
      navigate,
      100,
      0,
      matchId
    );
    setComments(commentsFromDatabase);
  }

  useEffect(() => {
    getAllCommentsAsync();
  }, []);

  async function handleOnSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const text = form.elements["comment-area"].value;
    const comment = { text, matchId };
    await createNewCommentAsync(comment, navigate);
    getAllCommentsAsync();
    setIsFormActive(false);
    form.elements["comment-area"].value = "";
  }
  return (
    <div className="align-self-center mt-5 d-flex flex-column width-400 max-height-full">
      <Button
        handleOnClick={() => setIsFormActive(true)}
        text="Komentiraj"
        color="secondary"
      />
      <div className={`${!isFormActive && "d-none"}`}>
        <Form handleOnSubmit={handleOnSubmit} buttonText="Dodaj komentar">
          <textarea
            id="comment-area"
            required
            className="my-3 resize-none"
          ></textarea>
        </Form>
      </div>
      <div className="mt-4 d-flex flex-column overflow-y-auto">
        {comments.map((comment) => {
          return <Comment key={comment.id} comment={comment} />;
        })}
      </div>
    </div>
  );
}
