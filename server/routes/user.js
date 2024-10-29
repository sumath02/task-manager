const router = require("express").Router();
const pool = require("../conn/conn"); // PostgreSQL connection
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authenticateToken = require("./auth");

// User Registration (Sign-In)
router.post("/sign-in", async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;

    const existingEmail = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    if (existingEmail.rows.length > 0) {
      return res.status(300).json({ message: "Email already exists" });
    }

    const hashPass = await bcrypt.hash(password, 10);

    const newUser = await pool.query(
      `INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4) RETURNING id`,
      [first_name, last_name, email, hashPass]
    );
    return res
      .status(200)
      .json({ message: "Sign up successful", userId: newUser.rows[0].id });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// User Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    if (existingUser.rows.length === 0) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(
      password,
      existingUser.rows[0].password
    );
    if (isMatch) {
      const token = jwt.sign(
        { userId: existingUser.rows[0].id },
        process.env.JWT_SECRET,
        { expiresIn: "2d" }
      );
      return res.status(200).json({ userId: existingUser.rows[0].id, token });
    } else {
      return res.status(400).json({ message: "Invalid credentials" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// User Profile
router.post("/profile", authenticateToken, async (req, res) => {
  const userId = req.user.userId; // Extracted from token
  try {
    const user = await pool.query(
      "SELECT first_name, last_name, email FROM users WHERE id = $1",
      [userId]
    );
    const tasks = await pool.query(
      "SELECT COUNT(*) FROM tasks WHERE user_id = $1",
      [userId]
    );

    if (user.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      name: `${user.rows[0].first_name} ${user.rows[0].last_name}`, // Full name
      email: user.rows[0].email,
      tasks: parseInt(tasks.rows[0].count, 10), //task count
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
