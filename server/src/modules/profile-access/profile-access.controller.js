import db from "../../config/db.js";

export const searchProfiles = async (req, res) => {
  const {
    professional_title,
    skills,
    experience_level,
    address,
    page = 1,
    limit = 10,
  } = req.query;

  const employerId = req.user.userId;

  try {
    const offset = (page - 1) * limit;
    const conditions = [
      "js.status = 'active'",
      "js.professional_title IS NOT NULL AND js.professional_title != ''",
      "js.experience_level IS NOT NULL AND js.experience_level != ''",
      "js.education_level IS NOT NULL AND js.education_level != ''",
      "js.gender IS NOT NULL",
    ];
    const values = [];
    let index = 1;

    if (professional_title) {
      conditions.push(`js.professional_title ILIKE $${index++}`);
      values.push(`%${professional_title}%`);
    }

    if (skills) {
      conditions.push(`js.skills::text ILIKE $${index++}`);
      values.push(`%${skills}%`);
    }

    if (experience_level) {
      conditions.push(`js.experience_level = $${index++}`);
      values.push(experience_level);
    }

    if (address) {
      conditions.push(`js.address ILIKE $${index++}`);
      values.push(`%${address}%`);
    }

    const whereClause = conditions.join(" AND ");

    // Get employer id from employers table
    const employerResult = await db.query(
      "SELECT id FROM employers WHERE user_id = $1",
      [employerId],
    );

    if (employerResult.rows.length === 0) {
      return res.status(404).json({ message: "Employer not found" });
    }

    const employer_id = employerResult.rows[0].id;

    const limitIdx = index++;
    const offsetIdx = index++;
    const employerIdx = index++;

    values.push(Number(limit), offset, employer_id);

    const result = await db.query(
      `SELECT
         js.id,
         js.user_id,
         js.professional_title,
         js.skills,
         js.experience_level,
         js.education_level,
         js.address,
         js.cv,
         COALESCE(u.email, js.user_email) AS email,
         CASE
           WHEN pa.id IS NOT NULL AND pa.expire_at > NOW() THEN true
           ELSE false
         END AS has_access,
         COUNT(*) OVER() AS total
       FROM job_seeker js
       LEFT JOIN users u ON js.user_id = u.id
       LEFT JOIN profile_access pa
         ON pa.job_seeker = js.id AND pa.employer = $${employerIdx}
       WHERE ${whereClause}
       ORDER BY js.created_at DESC
       LIMIT $${limitIdx} OFFSET $${offsetIdx}`,
      values,
    );

    const total = result.rows.length > 0 ? Number(result.rows[0].total) : 0;

    const profiles = result.rows.map(({ total: _, ...profile }) => profile);

    return res.status(200).json({
      total,
      page: Number(page),
      limit: Number(limit),
      profiles,
    });
  } catch (error) {
    console.error("Error searching profiles:", error);
    return res.status(500).json({ message: "Error searching profiles" });
  }
};

export const getMyAccess = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const employerId = req.user.userId;

  try {
    const offset = (page - 1) * limit;

    const employerResult = await db.query(
      "SELECT id FROM employers WHERE user_id = $1",
      [employerId],
    );

    if (employerResult.rows.length === 0) {
      return res.status(404).json({ message: "Employer not found" });
    }

    const employer_id = employerResult.rows[0].id;

    const result = await db.query(
      `SELECT
         pa.id AS access_id,
         pa.expire_at,
         pa.created_at AS access_granted_at,
         js.id AS jobseeker_id,
         js.user_id,
         js.first_name,
         js.last_name,
         js.professional_title,
         js.profile_image,
         js.professional_summary,
         js.cv,
         js.skills,
         js.experience_level,
         js.education_level,
         js.address,
         js.phone_number,
         js.linkedin,
         js.github,
         js.portfolio,
         COALESCE(u.email, js.user_email) AS email,
         COUNT(*) OVER() AS total
       FROM profile_access pa
       INNER JOIN job_seeker js ON pa.job_seeker = js.id
       LEFT JOIN users u ON js.user_id = u.id
       WHERE pa.employer = $1 AND pa.expire_at > NOW()
       ORDER BY pa.created_at DESC
       LIMIT $2 OFFSET $3`,
      [employer_id, Number(limit), offset],
    );

    const total = result.rows.length > 0 ? Number(result.rows[0].total) : 0;

    const profiles = result.rows.map(({ total: _, ...profile }) => profile);

    return res.status(200).json({
      total,
      page: Number(page),
      limit: Number(limit),
      profiles,
    });
  } catch (error) {
    console.error("Error fetching access list:", error);
    return res.status(500).json({ message: "Error fetching access list" });
  }
};

export const checkAccess = async (req, res) => {
  const { jobSeekerId } = req.params;
  const employerId = req.user.userId;

  try {
    const employerResult = await db.query(
      "SELECT id FROM employers WHERE user_id = $1",
      [employerId],
    );

    if (employerResult.rows.length === 0) {
      return res.status(404).json({ message: "Employer not found" });
    }

    const employer_id = employerResult.rows[0].id;

    const result = await db.query(
      `SELECT id, expire_at FROM profile_access
       WHERE employer = $1 AND job_seeker = $2 AND expire_at > NOW()`,
      [employer_id, jobSeekerId],
    );

    if (result.rows.length > 0) {
      return res.status(200).json({
        hasAccess: true,
        expiresAt: result.rows[0].expire_at,
      });
    }

    return res.status(200).json({ hasAccess: false, expiresAt: null });
  } catch (error) {
    console.error("Error checking access:", error);
    return res.status(500).json({ message: "Error checking access" });
  }
};

export const requestAccess = async (req, res) => {
  const { jobSeekerId } = req.params;
  const employerId = req.user.userId;

  try {
    const employerResult = await db.query(
      "SELECT id FROM employers WHERE user_id = $1",
      [employerId],
    );

    if (employerResult.rows.length === 0) {
      return res.status(404).json({ message: "Employer not found" });
    }

    const employer_id = employerResult.rows[0].id;

    // Check if job seeker exists
    const seekerResult = await db.query(
      "SELECT id FROM job_seeker WHERE id = $1 AND status = 'active'",
      [jobSeekerId],
    );

    if (seekerResult.rows.length === 0) {
      return res.status(404).json({ message: "Job seeker not found" });
    }

    // Check for existing active access
    const existing = await db.query(
      `SELECT id FROM profile_access
       WHERE employer = $1 AND job_seeker = $2 AND expire_at > NOW()`,
      [employer_id, jobSeekerId],
    );

    if (existing.rows.length > 0) {
      return res
        .status(409)
        .json({ message: "You already have active access to this profile" });
    }

    // Grant access for 30 days
    const expireAt = new Date();
    expireAt.setDate(expireAt.getDate() + 30);

    const insertFields = ["employer", "job_seeker", "expire_at"];
    const insertValues = [employer_id, jobSeekerId, expireAt];

    if (req.subscription?.id) {
      insertFields.push("subscription_id");
      insertValues.push(req.subscription.id);
    }

    const placeholders = insertValues.map((_, i) => `$${i + 1}`).join(", ");

    const result = await db.query(
      `INSERT INTO profile_access (${insertFields.join(", ")})
       VALUES (${placeholders})
       RETURNING *`,
      insertValues,
    );

    // Increment subscription usage
    if (req.subscription?.id) {
      await db.query(
        `UPDATE subscription_usage
         SET profile_access_used = profile_access_used + 1
         WHERE subscription_id = $1`,
        [req.subscription.id],
      );
    }

    return res.status(201).json({
      message: "Access granted successfully",
      access: result.rows[0],
    });
  } catch (error) {
    console.error("Error requesting access:", error);
    return res.status(500).json({ message: "Error requesting access" });
  }
};
