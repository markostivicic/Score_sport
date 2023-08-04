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
import Pagination from "../Pagination";
import { useResultContext } from "../../context/ResultContext";

export default function CommentSection({ matchId }) {
  const [isFormActive, setIsFormActive] = useState(false);
  const [comments, setComments] = useState([]);
  const [selectedCommentId, setSelectedCommentId] = useState(null);
  const [pageNumber, setPageNumber] = useState(0);
  const commentsPerPage = 3;
  const [pageCount, setPageCount] = useState(1);

  const navigate = useNavigate();
  const { lang } = useResultContext();

  const langParsed = JSON.parse(lang);

  async function getAllCommentsAsync() {
    const { items, totalCount } = await getCommentsAsync(
      navigate,
      commentsPerPage,
      pageNumber,
      matchId
    );
    setComments(items);
    setPageCount(Math.ceil(totalCount / commentsPerPage));
  }

  useEffect(() => {
    getAllCommentsAsync();
  }, [pageNumber]);

  const changePage = ({ selected }) => {
    setPageNumber(selected + 1);
  };

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
          handleOnClick={() => setIsFormActive(!isFormActive)}
          text={!isFormActive ? langParsed.strComment : langParsed.strCancel}
          color="secondary"
        />
        <div className={`${!isFormActive && "d-none"}`}>
          <Form
            handleOnSubmit={handleOnSubmit}
            buttonText={langParsed.strAddComment}
          >
            <textarea
              id="comment-area"
              required
              className="my-3 resize-none"
              ref={(e) => (e ? e.focus() : null)}
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

        <Pagination
          pageCount={pageCount}
          changePage={changePage}
          pageNumber={pageNumber}
        />
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
