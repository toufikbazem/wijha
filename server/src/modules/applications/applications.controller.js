import db from "../../config/db.js";

export const createApplication = async (req, res) => {
  const { jobId, jobseekerId } = req.body;
  if (!jobId || !jobseekerId) {
    return res
      .status(400)
      .json({ message: "Job ID and Jobseeker ID are required" });
  }
  if (jobseekerId !== req.user.id) {
    return res.status(403).json({
      message:
        "You are not authorized to apply for this job on behalf of another user",
    });
  }

  try {
    const application = await db.query(
      "INSERT INTO applications (job_post, jobseeker_id) VALUES ($1, $2)",
      [jobId, jobseekerId],
    );
    return res.status(201).json({
      message: "Application created successfully",
      applicationId: application.rows[0].id,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error creating application" });
  }
};

export const getApplication = async (req, res) => {
  const { id } = req.params;
  try {
    const application = await db.query(
      "SELECT * FROM applications WHERE id = $1",
      [id],
    );
    if (application.rows.length === 0) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (application.rows[0].jobseeker_id !== req.user.id) {
      return res.status(403).json({
        message: "You are not authorized to view this application",
      });
    }
    res.status(200).json(application.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Error fetching application" });
  }
};

export const getApplications = async (req, res) => {};

export const deleteApplication = async (req, res) => {
  const { id } = req.params;
  try {
    const application = await db.query(
      "SELECT * FROM applications WHERE id = $1",
      [id],
    );
    if (application.rows.length === 0) {
      return res.status(404).json({ message: "Application not found" });
    }
    const app = application.rows[0];
    if (app.jobseeker_id !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        message: "You are not authorized to delete this application",
      });
    }
    await db.query("DELETE FROM applications WHERE id = $1", [id]);
    res.status(200).json({ message: "Application deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting application" });
  }
};
