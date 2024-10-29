import React, { useEffect, useId, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Task from "./components/Task.component";
import Column from "./components/Column.component";
import AddTask from "./components/AddTask.component";
import ViewTask from "./components/ViewTask.component";
import EditTask from "./components/EditTask.component";
import {
  deleteTaskApi,
  getCompletedTaskApi,
  getInprogressTaskApi,
  getTodoTaskApi,
  updateTaskStatusApi,
} from "./API/api";
import "./style.css";
import Loader from "../Loader";
import { MenuItem, Select } from "@mui/material";
import { getUserProfileApi } from "../Navbar/Api/api";
export default function Tasks() {
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const [viewDetails, setViewDetails] = useState(false);
  const [updateTask, setUpdateTask] = useState(false);
  const [addTask, setAddTask] = useState(false);
  const [editTask, setEditTask] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [deletetaskId, setDeletetaskId] = useState(null);
  const [todoItems, setTodoItems] = useState([]);
  const [inProgressItems, setInProgressItems] = useState([]);
  const [completedItems, setCompletedTodoItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [todoLoader, setTodoLoader] = useState(false);
  const [inProgressLoader, setInProgressLoader] = useState(false);
  const [completeLoader, setCompleteLoader] = useState(false);
  const [sorting, setSorting] = useState("Recent");

  const filterAndSortTasks = (tasks) => {
    let filteredTasks = tasks;

    // Filter by search query
    if (searchQuery) {
      filteredTasks = filteredTasks.filter((task) =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort tasks by date
    filteredTasks.sort((a, b) => {
      if (sorting === "Recent") {
        return new Date(b.createdAt) - new Date(a.createdAt); // Most recent first
      } else {
        return new Date(a.createdAt) - new Date(b.createdAt); // Oldest first
      }
    });

    return filteredTasks;
  };

  const getTodoTask = useQuery({
    queryKey: ["getTodoTask"],
    queryFn: () => getTodoTaskApi(userId, token),
    refetchOnWindowFocus: false,
    refetchOnmount: false,
    refetchOnReconnect: false,
    retry: false,
    enabled: userId !== null && token !== null,
    onSuccess: (response) => {
      if (response.status === 200) {
        setTodoItems(response?.data?.data);
      } else {
        toast.error(response?.response?.data?.message);
      }
    },
    onError: (err) => {
      toast.error(err);
    },
  });
  useEffect(() => {
    setTodoLoader(getTodoTask?.isFetching);
  }, [getTodoTask?.isFetching]);
  const getInprogressTask = useQuery({
    queryKey: ["getInprogressTask"],
    queryFn: () => getInprogressTaskApi(userId, token),
    refetchOnWindowFocus: false,
    refetchOnmount: false,
    refetchOnReconnect: false,
    retry: false,
    enabled: userId !== null && token !== null,
    onSuccess: (response) => {
      if (response.status === 200) {
        setInProgressItems(response?.data?.data);
      } else {
        toast.error(response?.response?.data?.message);
      }
    },
    onError: (err) => {
      toast.error(err);
    },
  });
  useEffect(() => {
    setInProgressLoader(getInprogressTask?.isFetching);
  }, [getInprogressTask?.isFetching]);
  const getCompletedTask = useQuery({
    queryKey: ["getCompletedTask"],
    queryFn: () => getCompletedTaskApi(userId, token),
    refetchOnWindowFocus: false,
    refetchOnmount: false,
    refetchOnReconnect: false,
    retry: false,
    enabled: userId !== null && token !== null,
    onSuccess: (response) => {
      if (response.status === 200) {
        setCompletedTodoItems(response?.data?.data);
      } else {
        toast.error(response?.response?.data?.message);
      }
    },
    onError: (err) => {
      toast.error(err);
    },
  });
  useEffect(() => {
    setCompleteLoader(getCompletedTask?.isFetching);
  }, [getCompletedTask?.isFetching]);

  const getUserProfile = useQuery({
    queryKey: ["getUserProfile"],
    queryFn: () => getUserProfileApi(userId, token),
    refetchOnWindowFocus: false,
    refetchOnmount: false,
    refetchOnReconnect: false,
    retry: false,
    enabled: false,
    onSuccess: (response) => {
      let message = "";
      if (response.status === 200) {
        //   setUserProfile(response.data);
      } else {
        message = response?.response?.data?.message;
        toast.error(message);
      }
    },
    onError: (err) => {
      let message = response?.response?.data?.message;
      toast.error(err);
    },
  });

  const deleteTodoTask = useQuery({
    queryKey: ["getTodoTask", deletetaskId],
    queryFn: () => deleteTaskApi(deletetaskId, userId, token),
    refetchOnWindowFocus: false,
    refetchOnmount: false,
    refetchOnReconnect: false,
    retry: false,
    enabled: deletetaskId !== null && userId !== null && token !== null,
    onSuccess: (response) => {
      if (response.status === 200) {
        toast.success(response?.data?.message);
        let taskStatus = response?.data?.status;
        setDeletetaskId(null);
        if (taskStatus == "todo") {
          getTodoTask.refetch();
        } else if (taskStatus == "inProgress") {
          getInprogressTask.refetch();
        } else {
          getCompletedTask.refetch();
        }
        getUserProfile.refetch();
      } else {
        toast.error(response?.response?.data?.message);
      }
      setDeletetaskId(null);
    },
    onError: (err) => {
      toast.error(err);
    },
  });

  const handleDelete = (task_id) => {
    setDeletetaskId(task_id);
  };

  const handleEdit = (task) => {
    setTaskToEdit(task);
    setEditTask(true);
  };
  const handleViewDetails = (task) => {
    setViewDetails(true);
    setTaskToEdit(task);
  };
  const refetchingFunction = (sourceStatus, status) => {
    if (sourceStatus === "TODO" || status === "TODO") {
      getTodoTask.refetch();
    }
    if (sourceStatus === "IN_PROGRESS" || status === "IN_PROGRESS") {
      getInprogressTask.refetch();
    }
    if (sourceStatus === "COMPLETED" || status === "COMPLETED") {
      getCompletedTask.refetch();
    }
  };

  const updateTaskStatus = (taskId, sourceStatus, status, token) => {
    updateTaskStatusApi(taskId, status, token)
      .then((response) => {
        if (response.status === 200) {
          toast.success(response?.data?.message);
          refetchingFunction(sourceStatus, status);
        } else {
          toast.error(response?.response?.data?.message);
        }
      })
      .catch((err) => {
        toast.error(err);
      });
  };

  return (
    <div className="main_container">
      <div style={{ marginLeft: 10 }}>
        <button
          className="add_task_btn"
          style={{ cursor: "pointer" }}
          onClick={() => setAddTask(true)}
        >
          Add Task
        </button>
      </div>
      <div className="search_container">
        <div className="search_group">
          <span className="search_label">Search:</span>
          <input
            className="search_input"
            type="text"
            placeholder="Search..."
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="sort_group">
          <span className="sort_label">Sort By:</span>
          <Select
            size="small"
            className="sort_select"
            value={sorting}
            onChange={(e) => setSorting(e.target.value)}
          >
            <MenuItem value={"Recent"}>Recent</MenuItem>
            <MenuItem value={"Oldest"}>Oldest</MenuItem>
          </Select>
        </div>
      </div>

      <div className="task_container">
        <Column status="TODO" updateTaskStatus={updateTaskStatus}>
          <div className="task_title_div">
            <span style={{ padding: 10 }}>TODO</span>
          </div>
          <div className="task_inner_container">
            {todoLoader && <Loader />}
            {!todoLoader &&
              (todoItems && todoItems.length > 0 ? (
                filterAndSortTasks(todoItems).map((task) => (
                  <Task
                    key={task._id}
                    task={{ ...task, status: "TODO" }}
                    handleDelete={handleDelete}
                    handleEdit={handleEdit}
                    handleViewDetails={handleViewDetails}
                  />
                ))
              ) : (
                <div className="empty_message">
                  Please add some tasks to get started!
                </div>
              ))}
          </div>
        </Column>
        <Column status="IN_PROGRESS" updateTaskStatus={updateTaskStatus}>
          <div className="task_title_div">
            <span style={{ padding: 10 }}>IN PROGRESS</span>
          </div>
          <div className="task_inner_container">
            {inProgressLoader && <Loader />}
            {!inProgressLoader &&
              (inProgressItems && inProgressItems.length > 0 ? (
                filterAndSortTasks(inProgressItems).map((task) => (
                  <Task
                    key={task.id}
                    task={{ ...task, status: "IN_PROGRESS" }}
                    handleDelete={handleDelete}
                    handleEdit={handleEdit}
                    handleViewDetails={handleViewDetails}
                  />
                ))
              ) : (
                <div className="empty_message">
                  Please add some tasks in progress!
                </div>
              ))}
          </div>
        </Column>
        <Column status="COMPLETED" updateTaskStatus={updateTaskStatus}>
          <div className="task_title_div">
            <span style={{ padding: 10 }}>DONE</span>
          </div>
          <div className="task_inner_container">
            {completeLoader && <Loader />}
            {!completeLoader &&
              (completedItems && completedItems.length > 0 ? (
                filterAndSortTasks(completedItems).map((task) => (
                  <Task
                    key={task._id}
                    task={{ ...task, status: "COMPLETED" }}
                    handleDelete={handleDelete}
                    handleEdit={handleEdit}
                    handleViewDetails={handleViewDetails}
                  />
                ))
              ) : (
                <div className="empty_message">Please complete some tasks!</div>
              ))}
          </div>
        </Column>
      </div>
      {addTask && (
        <AddTask
          setAddTask={setAddTask}
          recallFunction={getTodoTask}
          getUserProfile={getUserProfile}
        />
      )}
      {viewDetails && (
        <ViewTask setViewDetails={setViewDetails} task={taskToEdit} />
      )}
      {editTask && (
        <EditTask
          task={taskToEdit}
          setEditTask={setEditTask}
          recallFunction={() => {
            getTodoTask.refetch();
            getInprogressTask.refetch();
            getCompletedTask.refetch();
          }}
        />
      )}
    </div>
  );
}
