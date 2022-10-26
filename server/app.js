const { application } = require("express");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require('dotenv');
dotenv.config();

const app = express();

app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json());
app.use(cors());

const accountRouter = require("./src/routes/account-route");
app.use("/api/account", accountRouter);

const adminStatisticsRouter = require("./src/routes/admin-statistics-route");
app.use("/api/admin-statistics", adminStatisticsRouter);

const projectRouter = require("./src/routes/project-route");
app.use("/api/projects", projectRouter);

const projectStatisticsRouter = require("./src/routes/project-statistics-route");
app.use("/api/project-statistics", projectStatisticsRouter);

const testRouter = require("./src/routes/test-route");
app.use("/api/test", testRouter);

const authorityRouter = require("./src/routes/authority-route");
app.use("/api/auth", authorityRouter);

const backlogRouter = require("./src/routes/backlog-route");
app.use("/api/backlogs", backlogRouter);

const backlogCommentRouter = require('./src/routes/backlog-comment-route');
app.use('/api/backlog-comments', backlogCommentRouter);

const sprintRouter = require("./src/routes/sprint-route");
app.use("/api/sprints", sprintRouter);

const tasksRouter = require("./src/routes/tasks-route");
app.use("/api/tasks", tasksRouter);

const taskCommentRouter = require("./src/routes/task-comment-route");
app.use("/api/task-comment", taskCommentRouter);

const inquiryRouter = require("./src/routes/inquiry-route");
app.use("/api/inquiries", inquiryRouter);

const inquiryCommentRouter = require("./src/routes/inquiry-comment-route");
app.use("/api/inquiry-comment", inquiryCommentRouter);

app.listen(8888, () => console.log("listening on port 8888..."));
