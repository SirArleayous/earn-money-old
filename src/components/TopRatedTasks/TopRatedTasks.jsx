import React from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../Hooks/useAuth";
import useRole from "../../Hooks/useRole";

const TopRatedTask = ({ ratedTask }) => {
  const { taskImage, title, detail, _id, payment, worker, completionDate } = ratedTask || {};
  const { user } = useAuth();
  const [role] = useRole();
  const navigate = useNavigate();

  let dateFormatted = "N/A";
  if (completionDate) {
    let date = new Date(completionDate);
    dateFormatted = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  }

  const handleViewDetails = (e) => {
    e.preventDefault();

    if (!user) {
      document.getElementById(`task_modal_${_id}`)?.showModal();
    } else if (role === "Worker" || role === "User") {
      navigate(`/task/${_id}`);
    } else {
      navigate(`/task/${_id}`);
    }
  };

  const handleDashboardRedirect = () => {
    navigate("/dashboard/taskLists");
  };

  return (
    <div>
      <div className="card shadow-xl">
        <figure>
          <img
            className="h-[250px] object-cover w-full"
            src={taskImage}
            alt="Task"
          />
        </figure>
        <div className="card-body">
          <h2 className="font-bold text-[18px]">{title}</h2>
          <p>{detail?.slice(0, 40)}...</p>
          <div className="card-actions justify-start">
            <button
              onClick={handleViewDetails}
              className="btn bg-[#00d7c0] hover:bg-[#00bfa8] text-slate-950 font-bold border-none"
            >
              View Details
            </button>
          </div>
        </div>
      </div>

      <dialog id={`task_modal_${_id}`} className="modal">
        <form method="dialog" className="modal-box max-w-3xl">
          <h3 className="font-bold text-lg text-black">SINEX Task Details</h3>
          <div className="py-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="md:w-1/3">
                <img
                  className="w-full h-[200px] object-cover rounded-lg"
                  src={taskImage}
                  alt={title}
                />
              </div>
              <div className="md:w-2/3 text-black">
                <h2 className="font-bold text-xl">{title}</h2>
                <p className="py-2">{detail}</p>
                <p className="py-1">
                  <span className="font-bold">Completion Date:</span> {dateFormatted}
                </p>
                <p className="py-1">
                  <span className="font-bold">Required Workers:</span> {worker}
                </p>
                <p className="py-1">
                  <span className="font-bold">Reward Payment:</span> ${payment}.00
                </p>
              </div>
            </div>
          </div>
          <div className="modal-action">
            <button className="btn">Close</button>
            <button
              onClick={handleDashboardRedirect}
              className="btn bg-[#00d7c0] hover:bg-[#00bfa8] text-slate-950 font-bold border-none"
            >
              Go to Task Directory
            </button>
          </div>
        </form>
      </dialog>
    </div>
  );
};

export default TopRatedTask;