import React, { useEffect, useState } from "react";
import "./style.css";
import { updateTaskApi } from "../API/api";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";

export default function EditTask({ task, setEditTask, recallFunction }) {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [payload, setPayload] = useState(null);
  const [loader, setLoader] = useState("");

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.desc);
    }
  }, [task]);

  const updateTask = useQuery({
    queryKey: ["updateTask", payload],
    queryFn: () => updateTaskApi(userId, task.id, payload, token),
    refetchOnWindowFocus: false,
    refetchOnmount: false,
    refetchOnReconnect: false,
    retry: false,
    enabled: payload != null,
    onSuccess: (response) => {
      let message = "";
      if (response.status === 200) {
        message = response?.data?.message;
        toast.success(message);
        setEditTask(false);
        recallFunction();
      } else {
        message = response?.response?.data?.message;
        toast.error(message);
      }
    },
    onError: (err) => {
      toast.error(err);
    },
  });

  useEffect(() => {
    setLoader(updateTask?.isFetching);
  }, [updateTask?.isFetching]);

  const handleSubmit = () => {
    const updatedPayload = { id: task.id, title: title, desc: description };
    setPayload(updatedPayload);
  };

  return (
    <>
      <div className="add_task_container"></div>
      <div className="add_task_inner_container">
        <div className="input_text_area_container">
          <div className="input_text_area_inner_container">
            <h3>Edit Task</h3>
            <div className="inside_container">
              <span className="insider_title">Title </span>
              <input
                className="input_task_style"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
              />
            </div>
            <div className="insider_container">
              <span className="insider_title">Description </span>
              <textarea
                type="text"
                rows={10}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="text_area_style"
                placeholder="Description"
              ></textarea>
            </div>
          </div>

          {loader && (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <ClipLoader />
            </div>
          )}
          {!loader && (
            <div className="button_container">
              <button
                className="save_btn"
                type="button"
                style={{
                  cursor: "pointer",
                  opacity: title === "" || description === "" ? 0.7 : 1,
                }}
                onClick={handleSubmit}
                disabled={title === "" || description === ""}
              >
                Save
              </button>
              <button
                className="close_btn"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setEditTask(false);
                }}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
