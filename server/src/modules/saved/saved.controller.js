import db from "../../config/db.js";

export const createSavedJob = async (req, res) => {
  const { jobId } = req.body;
  const userId = req.user.id;

  try {
    const result = await db.query(
      "INSERT INTO saved_jobs (job_seeker, job_post) VALUES ($1, $2) RETURNING *",
      [userId, jobId],
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
  const userId = req.user.id;

  try {
    const result = await db.query(
      "SELECT * FROM saved_jobs WHERE job_seeker = $1",
      [userId],
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: "Error fetching saved jobs" });
  }
};

export const deleteSavedJob = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const result = await db.query(
      "DELETE FROM saved_jobs WHERE id = $1 AND job_seeker = $2 RETURNING *",
      [id, userId],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Saved job not found" });
    }
    res.json({ message: "Saved job deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting saved job" });
  }
};
