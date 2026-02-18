import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./src/config/db.js";

//Routes Import  MJ
import mjauthRoutes from "./src/MJ/routes/auth.routes.js";
import mjuserRoutes from "./src/MJ/routes/user.routes.js";
import mjprojectRoutes from "./src/MJ/routes/project.routes.js";
import mjmoduleRoutes from "./src/MJ/routes/module.routes.js";
import mjworklogRoutes from "./src/MJ/routes/worklog.routes.js";
import mjtaskRoutes from "./src/MJ/routes/task.routes.js";
import mjreportRoutes from "./src/MJ/routes/report.routes.js";
import mjratingRoutes from "./src/MJ/routes/rating.routes.js"

//Routes Import IT
import ituserRoutes from "./src/IT/routes/user.routes.js";
import ittaskRoutes from "./src/IT/routes/task.route.js";
import itmoduleRoutes from "./src/IT/routes/module.routes.js";
import itworkLogRoutes from "./src/IT/routes/worklog.routes.js";
import itprojectRoutes from "./src/IT/routes/project.routes.js";
import itAuthRoutes from "./src/IT/routes/auth.routes.js";
import itRatingRoutes from "./src/IT/routes/rating.routes.js";
import itReportRoutes from "./src/IT/routes/report.routes.js";

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
app.use("/api/mj/auth", mjauthRoutes);
app.use("/api/mj/users", mjuserRoutes);
app.use("/api/mj/projects", mjprojectRoutes);
app.use("/api/mj/modules", mjmoduleRoutes);
app.use("/api/mj/worklog", mjworklogRoutes);
app.use("/api/mj/tasks", mjtaskRoutes);
app.use("/api/mj/report",mjreportRoutes);
app.use("/api/mj/rating", mjratingRoutes);

//Base Routs IT
app.use("/api/it/users", ituserRoutes);
app.use("/api/it/task", ittaskRoutes);
app.use("/api/it/module", itmoduleRoutes);
app.use("/api/it/worklog", itworkLogRoutes);
app.use("/api/it/project", itprojectRoutes);
app.use("/api/it/auth", itAuthRoutes);
app.use("/api/it/rating", itRatingRoutes);
app.use("/api/it/report", itReportRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`🚀server running on port ${PORT}`);
});
