import db from "../../config/db.js";

export const createApplication = async (req, res) => {
  const { jobId, jobseekerId } = req.body;
  if (!jobId || !jobseekerId) {
    return res
      .status(400)
      .json({ message: "Job ID and Jobseeker ID are required" });
  }

  try {
    const application = await db.query(
      "INSERT INTO applications (job_post, jobseeker) VALUES ($1, $2)",
      [jobId, jobseekerId],
    );

    await db.query(
      "UPDATE job_seeker SET applications = array_append(applications, $1) WHERE id = $2",
      [jobId, jobseekerId],
    );

    await db.query(
      "UPDATE job_post SET applicants = applicants + 1 WHERE id = $1",
      [jobId],
    );

    return res.status(201).json({
      message: "Application created successfully",
    });
  } catch (error) {
    console.error("Error creating application:", error);
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

export const getApplications = async (req, res) => {
  const { jobseekerId, sort = "latest", page = 1, limit = 10 } = req.query;
  const offset = (Number(page) - 1) * Number(limit);

  try {
    const result = await db.query(
      `SELECT applications.*, job_post.*, employers.company_name, employers.logo, employers.id AS employer_id,
              COUNT(*) OVER() AS total
      FROM applications
      INNER JOIN job_post ON applications.job_post = job_post.id
      INNER JOIN employers ON job_post.employer_id = employers.id
      WHERE applications.jobseeker = $1
      ORDER BY job_post.created_at ${sort === "latest" ? "DESC" : "ASC"}
      LIMIT $2 OFFSET $3`,
      [jobseekerId, Number(limit), offset],
    );

    const total = result.rows.length ? Number(result.rows[0].total) : 0;

    res.json({
      total,
      page: Number(page),
      limit: Number(limit),
      applications: result.rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching applications" });
  }
};

export const getApplicantsByJob = async (req, res) => {
  const { jobPostId } = req.params;
  const { page = 1, limit = 10 } = req.query;
  const offset = (Number(page) - 1) * Number(limit);

  try {
    // Ownership check: ensure the job post exists and belongs to the current employer
    const jobResult = await db.query(
      `SELECT jp.id, jp.title, jp.employer_id, e.user_id AS employer_user_id
       FROM job_post jp
       INNER JOIN employers e ON jp.employer_id = e.id
       WHERE jp.id = $1`,
      [jobPostId],
    );

    if (jobResult.rows.length === 0) {
      return res.status(404).json({ message: "Job post not found" });
    }

    const job = jobResult.rows[0];

    if (req.user.role !== "admin" && job.employer_user_id !== req.user.userId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to view these applicants" });
    }

    // Fetch applicants with pagination
    const result = await db.query(
      `SELECT
         applications.id AS application_id,
         applications.created_at AS applied_at,
         js.id AS jobseeker_id,
         js.user_id,
         js.first_name,
         js.last_name,
         js.professional_title,
         js.profile_image,
         js.professional_summary,
         js.cv,
         js.skills,
         js.experience_years,
         u.email,
         COUNT(*) OVER() AS total
       FROM applications
       INNER JOIN job_seeker js ON applications.jobseeker = js.id
       INNER JOIN users u ON js.user_id = u.id
       WHERE applications.job_post = $1
       ORDER BY applications.created_at DESC
       LIMIT $2 OFFSET $3`,
      [jobPostId, Number(limit), offset],
    );

    const total = result.rows.length ? Number(result.rows[0].total) : 0;

    return res.status(200).json({
      total,
      page: Number(page),
      limit: Number(limit),
      jobTitle: job.title,
      applicants: result.rows,
    });
  } catch (error) {
    console.error("Error fetching applicants:", error);
    return res.status(500).json({ message: "Error fetching applicants" });
  }
};

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
