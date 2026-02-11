import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./src/config/db.js";

//Routes Import  MJ
import authRoutes from "./src/MJ/routes/auth.routes.js";
import userRoutes from "./src/MJ/routes/user.routes.js";
import projectRoutes from "./src/MJ/routes/project.routes.js";
import moduleRoutes from "./src/MJ/routes/module.routes.js";
import worklogRoutes from "./src/MJ/routes/worklog.routes.js";
import taskRoutes from "./src/MJ/routes/task.routes.js";

//Routes Import IT
import usersRoutes from "./src/IT/routes/user.routes.js";
import tasksRoutes from "./src/IT/routes/task.route.js";
import modulesRoutes from "./src/IT/routes/module.routes.js";
import workLogsRoutes from "./src/IT/routes/worklog.routes.js";

dotenv.config();

connectDB();

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json("MJ Phase-1 Backend Running");
});

//Base Routes MJ
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/modules", moduleRoutes);
app.use("/api/worklog", worklogRoutes);
app.use("/api/tasks", taskRoutes);

//Base Routs IT
app.use("/api/it/users", usersRoutes);
app.use("/api/it/task", tasksRoutes);
app.use("/api/it/module", modulesRoutes);
app.use("/api/it/worklog", workLogsRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`🚀 MJ server running on port ${PORT}`);
});
