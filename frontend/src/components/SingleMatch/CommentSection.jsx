import React, { useEffect, useState } from "react";
import Button from "../Button";
import Form from "../Form";
import {
  createNewCommentAsync,
  deleteCommentByIdAsync,
  getCommentsAsync,
} from "../../services/CommentService";
import { useNavigate } from "react-router-dom";
import Comment from "./Comment";
import Modal from "../Modal";

export default function CommentSection({ matchId }) {
  const [isFormActive, setIsFormActive] = useState(false);
  const [comments, setComments] = useState([]);

  const [selectedCommentId, setSelectedCommentId] = useState(null);

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

  const handleConfirmDelete = () => {
    deleteCommentAsync(selectedCommentId);
    setSelectedCommentId(null);
  };

  async function deleteCommentAsync(id) {
    await deleteCommentByIdAsync(id, navigate);
    getAllCommentsAsync();
  }

  return (
    <>
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
            return (
              <Comment
                key={comment.id}
                comment={comment}
                setSelectedCommentId={setSelectedCommentId}
              />
            );
          })}
        </div>
      </div>
      <Modal
        selectedItem={selectedCommentId}
        handleCancelDelete={() => setSelectedCommentId(null)}
        handleConfirmDelete={handleConfirmDelete}
        isComment={true}
      />
    </>
  );
}
