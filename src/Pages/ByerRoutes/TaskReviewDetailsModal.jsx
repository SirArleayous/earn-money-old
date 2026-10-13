import React from "react";

// Links inside the worker's evidence become clickable (http/https only)
const linkify = (text = "") =>
  text.split(/(https?:\/\/\S+)/g).map((part, i) =>
    /^https?:\/\//.test(part) ? (
      <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-[#00d7c0] underline break-all">
        {part}
      </a>
    ) : (
      part
    )
  );

const TaskReviewDetailsModal = ({ reviewDetail, handleReview }) => {
  const close = () => document.getElementById("review_modal")?.close();
  const act = async (status) => {
    if (await handleReview(reviewDetail, status)) close();
  };
  const pending = reviewDetail?.status === "Pending";

  return (
    <div>
      {/* Opened with document.getElementById('review_modal').showModal() */}
      <dialog id="review_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">{reviewDetail?.task_title || "Submission"}</h3>
          {reviewDetail && (
            <div className="text-sm pt-3 space-y-1">
              <p><span className="opacity-60">Worker:</span> {reviewDetail.worker_name}</p>
              <p>
                <span className="opacity-60">Worker ID:</span> <span className="font-mono">{reviewDetail.worker_code}</span>{" "}
                <span className="text-xs opacity-50">({reviewDetail.worker_id})</span>
              </p>
              <p><span className="opacity-60">Email:</span> {reviewDetail.worker_email}</p>
              <p><span className="opacity-60">Reward:</span> {reviewDetail.payable_amount} coins</p>
              <p><span className="opacity-60">Status:</span> {reviewDetail.status}</p>
            </div>
          )}
          <p className="py-4 whitespace-pre-line break-words">{linkify(reviewDetail?.submission_detail)}</p>
          <div className="modal-action">
            {pending && (
              <>
                <button onClick={() => act("Approved")} className="btn btn-success text-white">Approve</button>
                <button onClick={() => act("Rejected")} className="btn btn-error text-white">Reject</button>
              </>
            )}
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default TaskReviewDetailsModal;