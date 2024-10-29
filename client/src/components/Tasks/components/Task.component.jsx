import React from "react";
import { useDrag } from "react-dnd";
import moment from "moment";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import "./style.css";

const Task = ({ task, handleDelete, handleEdit, handleViewDetails }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "TASK",
    item: { id: task.id, status: task.status },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      className="task_content"
      ref={drag}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <div>
        <h3>{task.title}</h3>
        <p className="task_description">{task.desc}</p>
      </div>

      <div className="btn_container">
        <div className="task_description">
          Created at: {moment(task.createdAt).format("DD/MM/YYYY, HH:mm:ss")}
        </div>
        <IconButton
          className="fun_btn"
          onClick={() => handleDelete(task.id)}
          aria-label="delete"
          style={{ color: "#D32F2F" }} // Red color for delete
        >
          <DeleteIcon />
        </IconButton>
        <IconButton
          className="fun_btn light_blue"
          onClick={() => handleEdit(task)}
          aria-label="edit"
          style={{ color: "#1976D2" }} // Blue color for edit
        >
          <EditIcon />
        </IconButton>
        <IconButton
          className="fun_btn blue"
          onClick={() => handleViewDetails(task)}
          aria-label="view details"
          style={{ color: "#4CAF50" }} // Green color for view details
        >
          <VisibilityIcon />
        </IconButton>
      </div>
    </div>
  );
};

export default Task;
