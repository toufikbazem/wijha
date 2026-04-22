import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import auth from "./src/modules/auth/auth.routes.js";
import employers from "./src/modules/employers/employers.routes.js";
import jobPosts from "./src/modules/job_posts/job_posts.routes.js";
import jobseekers from "./src/modules/job-seekers/jobseeker.routes.js";
import savedJobs from "./src/modules/saved/saved.routes.js";
import applications from "./src/modules/applications/applications.routes.js";
import experiences from "./src/modules/experiences/experiences.routes.js";
import educations from "./src/modules/educations/educations.routes.js";
import languages from "./src/modules/languages/languages.routes.js";
import users from "./src/modules/users/users.routes.js";
import profileAccess from "./src/modules/profile-access/profile-access.routes.js";
import subscriptions from "./src/modules/subscriptions/subscriptions.routes.js";
import admin from "./src/modules/admin/admin.routes.js";
import contact from "./src/modules/contact/contact.routes.js";

const app = express();
dotenv.config();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/auth", auth);
app.use("/api/v1/users", users);
app.use("/api/v1/employers", employers);
app.use("/api/v1/job-posts", jobPosts);
app.use("/api/v1/jobseekers", jobseekers);
app.use("/api/v1/saved-jobs", savedJobs);
app.use("/api/v1/applications", applications);
app.use("/api/v1/experiences", experiences);
app.use("/api/v1/educations", educations);
app.use("/api/v1/languages", languages);
app.use("/api/v1/profile-access", profileAccess);
app.use("/api/v1/subscriptions", subscriptions);
app.use("/api/v1/admin", admin);
app.use("/api/v1/contact", contact);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({ succes: false, message });
});
