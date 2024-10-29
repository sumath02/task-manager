// app.js
const express = require("express");
const cors = require("cors");
// connect to database
require("dotenv").config();
require("./conn/conn");
const app = express();
app.use(express.json());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

const UserApi = require("./routes/user");
const TaskApi = require("./routes/task");
const GoogleApi = require("./routes/googleauth");

app.use("/api/v1", UserApi);
app.use("/api/v2", TaskApi);
app.use("/api/v3", GoogleApi);

app.use("/", (req, res) => {
  res.send("task manager server working!");
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log("Server listening on port: ", PORT);
});
