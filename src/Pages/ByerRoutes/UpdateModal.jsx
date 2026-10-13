import React from "react";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import axios from "axios";
import toast from "react-hot-toast";
import { IoMdClose } from "react-icons/io";
const Image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${Image_hosting_key}`;
const UpdateModal = ({ singleTask, myTaskRefetch }) => {
  const axiosSecure = useAxiosSecure();
  const { _id, title, detail, submission_info } = singleTask || {};

  const handleUpdateTask = async (e) => {
    e.preventDefault();
    const form = e.target;
    const updateTask = {
      title: form.title.value,
      detail: form.detail.value,
      submission_info: form.submission_info.value,
    };

    // optional new task image
    const file = form.file.files[0];
    if (file) {
      if (!Image_hosting_key) {
        toast("Image hosting key is missing, the image was skipped", { icon: "⚠️" });
      } else {
        try {
          const formData = new FormData();
          formData.append("image", file);
          const res = await axios.post(image_hosting_api, formData);
          updateTask.task_image = res.data.data.url;
        } catch (err) {
          console.log("Error uploading image:", err);
          toast("Image upload failed, the other changes are still saved", { icon: "⚠️" });
        }
      }
    }

    try {
      await axiosSecure.patch(`/api/tasks/${_id}`, updateTask);
      toast.success("Successfully Updated");
      myTaskRefetch();
      document.getElementById("my_modal_1").close();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not update the task");
    }
  };

  const handleCloseModal = () => {
    document.getElementById("my_modal_1").close();
  };

  return (
    <div className="relative">
      {/* Open the modal using document.getElementById('ID').showModal() method */}

      <dialog id="my_modal_1" className="modal">
      <div className="">
      <button onClick={handleCloseModal} className="btn"><IoMdClose></IoMdClose></button>
      </div>
        <div className="modal-box">
          <div className="card bg-base-100 w-full max-w-md shrink-0 shadow-2xl">
            {/* key remounts the form so the fields always show the selected task */}
            <form key={_id} onSubmit={handleUpdateTask} className="card-body">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Title</span>
                </label>
                <input
                  defaultValue={title}
                  type="text"
                  placeholder="Title"
                  name="title"
                  className="input input-bordered"
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Task Detail</span>
                </label>

                <input
                  defaultValue={detail}
                  type="text"
                  placeholder="Task Detail"
                  name="detail"
                  className="input input-bordered"
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Submission Info (proof workers must send)</span>
                </label>
                <input
                  defaultValue={submission_info}
                  type="text"
                  placeholder="e.g. Screenshot link + username"
                  name="submission_info"
                  className="input input-bordered"
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">New Task Image (optional)</span>
                </label>
                <input
                  type="file"
                  name="file"
                  accept="image/*"
                  className="file-input file-input-bordered w-full max-w-xl"
                />
              </div>
              <div className="form-control mt-6">
                <button className="btn bg-accent font-bold text-white">
                  Update
                </button>
              </div>
            </form>
          </div>

        </div>
      </dialog>
    </div>
  );
};

export default UpdateModal;