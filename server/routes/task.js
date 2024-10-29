const router = require("express").Router();
const pool = require("../conn/conn"); // PostgreSQL connection
const authenticateToken = require("./auth");

// Create Task
router.post("/create-task", authenticateToken, async (req, res) => {
  try {
    const { title, desc } = req.body;
    const userId = req.user.userId; // Extracted from token

    const newTask = await pool.query(
      `INSERT INTO tasks (title, description, user_id) VALUES ($1, $2, $3) RETURNING id`,
      [title, desc, userId]
    );
    res.status(200).json({
      message: "Task created successfully",
      taskId: newTask.rows[0].id,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get All Tasks (To Do)
router.get("/all-tasks", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const tasks = await pool.query(
      `SELECT id, title, description AS desc, todo, in_progress, completed, created_at FROM tasks WHERE user_id = $1 AND todo = true ORDER BY created_at DESC`,
      [userId]
    );
    res.status(200).json({ data: tasks.rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// Delete Task
router.delete("/delete-task/:id", authenticateToken, async (req, res) => {
  try {
    const taskId = req.params.id;
    const task = await pool.query(
      `DELETE FROM tasks WHERE id = $1 RETURNING *`,
      [taskId]
    );

    const status = task.rows[0].todo
      ? "todo"
      : task.rows[0].in_progress
      ? "inProgress"
      : "complete";
    res.status(200).json({ message: "Task deleted successfully", status });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// Update Task
router.put("/update-task/:id", authenticateToken, async (req, res) => {
  try {
    const taskId = req.params.id;
    const { title, desc } = req.body;

    await pool.query(
      `UPDATE tasks SET title = $1, description = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3`,
      [title, desc, taskId]
    );
    res.status(200).json({ message: "Task Updated successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// Update Task Status - Todo
router.put("/tasks/todo/:id", authenticateToken, async (req, res) => {
  try {
    const taskId = req.params.id;
    await pool.query(
      `UPDATE tasks SET todo = true, in_progress = false, completed = false WHERE id = $1`,
      [taskId]
    );
    res.status(200).json({ message: "Task status changed to todo" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// Update Task Status - In Progress
router.put("/tasks/inprogress/:id", authenticateToken, async (req, res) => {
  try {
    const taskId = req.params.id;
    await pool.query(
      `UPDATE tasks SET todo = false, in_progress = true, completed = false WHERE id = $1`,
      [taskId]
    );
    res.status(200).json({ message: "Task status changed to in-progress" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// Update Task Status - Completed
router.put("/tasks/completed/:id", authenticateToken, async (req, res) => {
  try {
    const taskId = req.params.id;
    await pool.query(
      `UPDATE tasks SET todo = false, in_progress = false, completed = true WHERE id = $1`,
      [taskId]
    );
    res.status(200).json({ message: "Task status changed to completed" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get All In Progress Tasks
router.get("/all-tasks/inprogress", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const tasks = await pool.query(
      `SELECT id, title, description AS desc, todo, in_progress, completed, created_at FROM tasks WHERE user_id = $1 AND in_progress = true ORDER BY created_at DESC`,
      [userId]
    );
    res.status(200).json({ data: tasks.rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get All Completed Tasks
router.get("/all-tasks/completed", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const tasks = await pool.query(
      `SELECT id, title, description AS desc, todo, in_progress, completed, created_at FROM tasks WHERE user_id = $1 AND completed = true ORDER BY created_at DESC`,
      [userId]
    );
    res.status(200).json({ data: tasks.rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
