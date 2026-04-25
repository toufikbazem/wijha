import db from "../../config/db.js";

export const createSavedJob = async (req, res) => {
  const { jobId, userId } = req.body;

  try {
    const user = await db.query("SELECT * FROM job_seeker WHERE id = $1", [
      userId,
    ]);
    if (
      user.rows[0].status !== "active" &&
      user.rows[0].status !== "unverified"
    ) {
      return res.status(403).json({
        error_code: "ACCOUNT_INACTIVE",
        message: "Your account is not active. Please contact support.",
      });
    }

    const result = await db.query(
      "INSERT INTO saved_jobs (job_seeker, job_post) VALUES ($1, $2) RETURNING *",
      [userId, jobId],
    );
    await db.query(
      "UPDATE job_seeker SET saved = array_append(saved, $1) WHERE id = $2",
      [jobId, userId],
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Error creating saved job" });
  }
};

export const getSavedJob = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const result = await db.query(
      "SELECT * FROM saved_jobs WHERE id = $1 AND job_seeker = $2",
      [id, userId],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Saved job not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Error fetching saved job" });
  }
};

export const getSavedJobs = async (req, res) => {
  const { jobseekerId, sort = "latest", page = 1, limit = 10 } = req.query;
  const offset = (Number(page) - 1) * Number(limit);

  try {
    const result = await db.query(
      `SELECT saved_jobs.*, job_post.*, employers.company_name, employers.logo, employers.id AS employer_id,
              COUNT(*) OVER() AS total
      FROM saved_jobs
      INNER JOIN job_post ON saved_jobs.job_post = job_post.id
      INNER JOIN employers ON job_post.employer_id = employers.id
      WHERE saved_jobs.job_seeker = $1
      ORDER BY job_post.created_at ${sort === "latest" ? "DESC" : "ASC"}
      LIMIT $2 OFFSET $3`,
      [jobseekerId, Number(limit), offset],
    );

    const total = result.rows.length ? Number(result.rows[0].total) : 0;

    res.json({
      total,
      page: Number(page),
      limit: Number(limit),
      savedJobs: result.rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching saved jobs" });
  }
};

export const deleteSavedJob = async (req, res) => {
  const { jobId, userId } = req.body;

  try {
    const user = await db.query("SELECT * FROM job_seeker WHERE id = $1", [
      userId,
    ]);
    if (
      user.rows[0].status !== "active" &&
      user.rows[0].status !== "unverified"
    ) {
      return res.status(403).json({
        error_code: "ACCOUNT_INACTIVE",
        message: "Your account is not active. Please contact support.",
      });
    }
    const result = await db.query(
      "DELETE FROM saved_jobs WHERE job_post = $1 AND job_seeker = $2 RETURNING *",
      [jobId, userId],
    );

    await db.query(
      "UPDATE job_seeker SET saved = array_remove(saved, $1) WHERE id = $2",
      [jobId, userId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Saved job not found" });
    }
    res.json({ message: "Saved job deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting saved job" });
  }
};
