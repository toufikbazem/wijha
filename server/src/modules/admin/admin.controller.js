import db from "../../config/db.js";

// ─── Dashboard ───────────────────────────────────────────────
export const getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsersResult,
      totalEmployersResult,
      totalJobSeekersResult,
      totalJobPostsResult,
      jobPostsByStatusResult,
      activeSubscriptionsResult,
      recentUsersResult,
      recentJobPostsResult,
    ] = await Promise.all([
      db.query("SELECT COUNT(*) AS count FROM users WHERE role != 'admin'"),
      db.query("SELECT COUNT(*) AS count FROM employers"),
      db.query("SELECT COUNT(*) AS count FROM job_seeker"),
      db.query(
        "SELECT COUNT(*) AS count FROM job_post WHERE status != 'Deleted'",
      ),
      db.query(
        `SELECT status, COUNT(*) AS count FROM job_post
         WHERE status != 'Deleted'
         GROUP BY status`,
      ),
      db.query(
        "SELECT COUNT(*) AS count FROM subscriptions WHERE status = 'active' AND end_day >= CURRENT_DATE",
      ),
      db.query(
        `SELECT u.id, u.email, u.role, u.created_at,
           COALESCE(js.status, e.status) AS status,
           COALESCE(js.first_name || ' ' || js.last_name, e.company_name) AS name
         FROM users u
         LEFT JOIN job_seeker js ON u.id = js.user_id
         LEFT JOIN employers e ON u.id = e.user_id
         WHERE u.role != 'admin'
         ORDER BY u.created_at DESC LIMIT 5`,
      ),
      db.query(
        `SELECT jp.id, jp.title, jp.status, jp.created_at, e.company_name
         FROM job_post jp
         INNER JOIN employers e ON jp.employer_id = e.id
         WHERE jp.status != 'Deleted'
         ORDER BY jp.created_at DESC LIMIT 5`,
      ),
    ]);

    const jobPostsByStatus = {};
    jobPostsByStatusResult.rows.forEach((row) => {
      jobPostsByStatus[row.status] = parseInt(row.count);
    });

    return res.status(200).json({
      totalUsers: parseInt(totalUsersResult.rows[0].count),
      totalEmployers: parseInt(totalEmployersResult.rows[0].count),
      totalJobSeekers: parseInt(totalJobSeekersResult.rows[0].count),
      totalJobPosts: parseInt(totalJobPostsResult.rows[0].count),
      jobPostsByStatus,
      activeSubscriptions: parseInt(activeSubscriptionsResult.rows[0].count),
      recentUsers: recentUsersResult.rows,
      recentJobPosts: recentJobPostsResult.rows,
    });
  } catch (error) {
    console.error("Error fetching admin dashboard stats:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ─── Job Seekers ─────────────────────────────────────────────
export const getJobSeekers = async (req, res) => {
  const { search, status, page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  try {
    const conditions = [];
    const values = [];
    let index = 1;

    if (search) {
      conditions.push(
        `(js.first_name ILIKE $${index} OR js.last_name ILIKE $${index} OR COALESCE(u.email, js.user_email) ILIKE $${index})`,
      );
      values.push(`%${search}%`);
      index++;
    }

    if (status) {
      conditions.push(`js.status = $${index}`);
      values.push(status);
      index++;
    }

    const whereClause =
      conditions.length > 0 ? "WHERE " + conditions.join(" AND ") : "";
    const limitIdx = index++;
    const offsetIdx = index++;
    values.push(Number(limit), offset);

    const result = await db.query(
      `SELECT
         js.id AS jobseeker_id,
         js.first_name, js.last_name,
         js.professional_title, js.phone_number, js.address, js.status,
         js.profile_image, js.user_email,
         js.user_id,
         COALESCE(u.email, js.user_email) AS email,
         u.role, u.is_email_verified,
         COALESCE(u.created_at, js.created_at) AS created_at,
         CASE WHEN js.user_id IS NULL THEN true ELSE false END AS is_admin_created,
         COUNT(*) OVER() AS total
       FROM job_seeker js
       LEFT JOIN users u ON js.user_id = u.id
       ${whereClause}
       ORDER BY COALESCE(u.created_at, js.created_at) DESC
       LIMIT $${limitIdx} OFFSET $${offsetIdx}`,
      values,
    );

    const total = result.rows.length > 0 ? Number(result.rows[0].total) : 0;
    const jobSeekers = result.rows.map(({ total: _, ...row }) => row);

    return res
      .status(200)
      .json({ total, page: Number(page), limit: Number(limit), jobSeekers });
  } catch (error) {
    console.error("Error fetching job seekers:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getJobSeekerDetails = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(
      `SELECT
         js.*,
         COALESCE(u.email, js.user_email) AS email,
         u.role, u.is_email_verified,
         COALESCE(u.created_at, js.created_at) AS account_created_at,
         CASE WHEN js.user_id IS NULL THEN true ELSE false END AS is_admin_created
       FROM job_seeker js
       LEFT JOIN users u ON js.user_id = u.id
       WHERE js.id = $1`,
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Job seeker not found" });
    }

    const profile = result.rows[0];
    const userId = profile.user_id;

    const [experiences, educations, languages] = await Promise.all([
      userId
        ? db.query("SELECT * FROM experiences WHERE user_id = $1", [userId])
        : { rows: [] },
      userId
        ? db.query("SELECT * FROM educations WHERE user_id = $1", [userId])
        : { rows: [] },
      userId
        ? db.query("SELECT * FROM languages WHERE user_id = $1", [userId])
        : { rows: [] },
    ]);

    return res.status(200).json({
      ...profile,
      experiences: experiences.rows,
      educations: educations.rows,
      languages: languages.rows,
    });
  } catch (error) {
    console.error("Error fetching job seeker details:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const createJobSeekerProfile = async (req, res) => {
  const {
    first_name,
    last_name,
    user_email,
    professional_title,
    phone_number,
    address,
    gender,
    experience_level,
    education_level,
    cv,
    status = "unverified",
  } = req.body;

  if (!first_name || !last_name || !user_email) {
    return res
      .status(400)
      .json({ message: "first_name, last_name, and user_email are required" });
  }

  const validStatuses = ["active", "deactivated", "unverified", "suspended"];
  if (!validStatuses.includes(status)) {
    return res
      .status(400)
      .json({
        message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
      });
  }

  try {
    const existing = await db.query(
      "SELECT id FROM job_seeker WHERE user_email = $1",
      [user_email],
    );
    if (existing.rows.length > 0) {
      return res
        .status(409)
        .json({ message: "A profile with this email already exists" });
    }

    const result = await db.query(
      `INSERT INTO job_seeker (first_name, last_name, user_email, professional_title, phone_number, address, gender, experience_level, education_level, cv, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [
        first_name,
        last_name,
        user_email,
        professional_title || null,
        phone_number || null,
        address || null,
        gender || null,
        experience_level || null,
        education_level || null,
        cv || null,
        status,
      ],
    );

    return res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating job seeker profile:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const changeJobSeekerStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ["active", "deactivated", "unverified", "suspended"];
  if (!status || !validStatuses.includes(status)) {
    return res
      .status(400)
      .json({
        message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
      });
  }

  try {
    // Support lookup by jobseeker_id (for admin-created profiles) or user_id
    const result = await db.query(
      "UPDATE job_seeker SET status = $1 WHERE id = $2 RETURNING *",
      [status, id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Job seeker not found" });
    }

    return res
      .status(200)
      .json({ message: "Status updated", jobSeeker: result.rows[0] });
  } catch (error) {
    console.error("Error changing job seeker status:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteJobSeeker = async (req, res) => {
  const { id } = req.params;

  try {
    // id here is jobseeker_id (js.id), not user_id
    const js = await db.query(
      "SELECT id, user_id FROM job_seeker WHERE id = $1",
      [id],
    );
    if (js.rows.length === 0) {
      return res.status(404).json({ message: "Job seeker not found" });
    }

    const { user_id } = js.rows[0];

    // Delete the job_seeker record first
    await db.query("DELETE FROM job_seeker WHERE id = $1", [id]);

    // If there's a linked user account, delete it too
    if (user_id) {
      await db.query("DELETE FROM users WHERE id = $1", [user_id]);
    }

    return res.status(200).json({ message: "Job seeker deleted successfully" });
  } catch (error) {
    console.error("Error deleting job seeker:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ─── Employers ───────────────────────────────────────────────
export const getEmployers = async (req, res) => {
  const { search, status, page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  try {
    const conditions = ["u.role = 'employer'"];
    const values = [];
    let index = 1;

    if (search) {
      conditions.push(
        `(e.company_name ILIKE $${index} OR u.email ILIKE $${index})`,
      );
      values.push(`%${search}%`);
      index++;
    }

    if (status) {
      conditions.push(`e.status = $${index}`);
      values.push(status);
      index++;
    }

    const whereClause = conditions.join(" AND ");
    const limitIdx = index++;
    const offsetIdx = index++;
    values.push(Number(limit), offset);

    const result = await db.query(
      `SELECT
         u.id, u.email, u.role, u.created_at, u.is_email_verified,
         e.id AS employer_id, e.company_name, e.industry, e.size,
         e.address, e.phone_number, e.status, e.logo,
         COUNT(*) OVER() AS total
       FROM users u
       INNER JOIN employers e ON u.id = e.user_id
       WHERE ${whereClause}
       ORDER BY u.created_at DESC
       LIMIT $${limitIdx} OFFSET $${offsetIdx}`,
      values,
    );

    const total = result.rows.length > 0 ? Number(result.rows[0].total) : 0;
    const employers = result.rows.map(({ total: _, ...row }) => row);

    return res
      .status(200)
      .json({ total, page: Number(page), limit: Number(limit), employers });
  } catch (error) {
    console.error("Error fetching employers:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getEmployerDetails = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(
      `SELECT u.id, u.email, u.role, u.created_at, u.is_email_verified,
         e.*
       FROM users u
       INNER JOIN employers e ON u.id = e.user_id
       WHERE u.id = $1`,
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Employer not found" });
    }

    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching employer details:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const changeEmployerStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ["active", "suspended", "unverified", "deactivated"];
  if (!status || !validStatuses.includes(status)) {
    return res
      .status(400)
      .json({
        message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
      });
  }

  try {
    const result = await db.query(
      "UPDATE employers SET status = $1 WHERE user_id = $2 RETURNING *",
      [status, id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Employer not found" });
    }

    return res
      .status(200)
      .json({ message: "Status updated", employer: result.rows[0] });
  } catch (error) {
    console.error("Error changing employer status:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteEmployer = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await db.query(
      "SELECT id FROM users WHERE id = $1 AND role = 'employer'",
      [id],
    );
    if (user.rows.length === 0) {
      return res.status(404).json({ message: "Employer not found" });
    }

    await db.query("DELETE FROM users WHERE id = $1", [id]);

    return res.status(200).json({ message: "Employer deleted successfully" });
  } catch (error) {
    console.error("Error deleting employer:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ─── Job Posts ────────────────────────────────────────────────
export const getJobPosts = async (req, res) => {
  const {
    search,
    status,
    employer_id,
    sortBy = "newest",
    page = 1,
    limit = 10,
  } = req.query;

  const offset = (page - 1) * limit;

  try {
    const conditions = [];
    const values = [];
    let index = 1;

    if (search) {
      conditions.push(
        `(jp.title ILIKE $${index} OR e.company_name ILIKE $${index})`,
      );
      values.push(`%${search}%`);
      index++;
    }

    if (status) {
      conditions.push(`jp.status = $${index}`);
      values.push(status);
      index++;
    }

    if (employer_id) {
      conditions.push(`jp.employer_id = $${index}`);
      values.push(employer_id);
      index++;
    }

    conditions.unshift("jp.status != 'Deleted'");
    const whereClause = "WHERE " + conditions.join(" AND ");
    const orderClause = sortBy === "oldest" ? "jp.created_at ASC" : "jp.created_at DESC";
    const limitIdx = index++;
    const offsetIdx = index++;
    values.push(Number(limit), offset);

    const result = await db.query(
      `SELECT
         jp.id, jp.title, jp.status, jp.status_reason, jp.location, jp.job_type, jp.job_mode,
         jp.experience_level, jp.created_at, jp.deadline, jp.applicants,
         e.company_name, e.logo, e.user_id AS employer_user_id,
         COUNT(*) OVER() AS total
       FROM job_post jp
       LEFT JOIN employers e ON jp.employer_id = e.id
       ${whereClause}
       ORDER BY ${orderClause}
       LIMIT $${limitIdx} OFFSET $${offsetIdx}`,
      values,
    );

    const total = result.rows.length > 0 ? Number(result.rows[0].total) : 0;
    const jobPosts = result.rows.map(({ total: _, ...row }) => row);

    return res
      .status(200)
      .json({ total, page: Number(page), limit: Number(limit), jobPosts });
  } catch (error) {
    console.error("Error fetching job posts:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getJobPostDetails = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(
      `SELECT jp.*,
         e.company_name, e.logo, e.user_id AS employer_user_id,
         e.industry AS employer_industry, e.size AS employer_size
       FROM job_post jp
       LEFT JOIN employers e ON jp.employer_id = e.id
       WHERE jp.id = $1`,
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Job post not found" });
    }

    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching job post details:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const changeJobPostStatus = async (req, res) => {
  const { id } = req.params;
  const { status, status_reason } = req.body;

  const validStatuses = ["Draft", "Active", "In-review", "Pending", "Paused", "Rejected", "Expired", "Deleted"];

  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({ message: `Invalid status. Must be one of: ${validStatuses.join(", ")}` });
  }

  const requiresReason = ["Pending", "Rejected"];
  if (requiresReason.includes(status) && !status_reason?.trim()) {
    return res.status(400).json({ message: "A reason is required when setting status to Pending or Rejected" });
  }

  try {
    const result = await db.query(
      "UPDATE job_post SET status = $1, status_reason = $2 WHERE id = $3 RETURNING *",
      [
        status,
        requiresReason.includes(status) ? status_reason.trim() : null,
        id,
      ],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Job post not found" });
    }

    return res
      .status(200)
      .json({ message: "Status updated", jobPost: result.rows[0] });
  } catch (error) {
    console.error("Error changing job post status:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteJobPost = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query("DELETE FROM job_post WHERE id = $1 RETURNING id", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Job post not found" });
    }
    return res.status(200).json({ message: "Job post permanently deleted" });
  } catch (error) {
    console.error("Error deleting job post:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const createAdminJobPost = async (req, res) => {
  const {
    employer_id,
    is_anonymous,
    title,
    description,
    location,
    job_type,
    job_mode,
    industry,
    experience_level,
    education_level,
    number_of_positions,
    min_salary,
    max_salary,
    deadline,
  } = req.body;

  if (!title) {
    return res.status(400).json({ message: "title is required" });
  }

  if (!is_anonymous && !employer_id) {
    return res
      .status(400)
      .json({ message: "Either employer_id or is_anonymous must be provided" });
  }

  try {
    if (employer_id) {
      const emp = await db.query("SELECT id FROM employers WHERE id = $1", [
        employer_id,
      ]);
      if (emp.rows.length === 0) {
        return res.status(404).json({ message: "Employer not found" });
      }
    }

    const columns = ["title", "status", "created_by"];
    const values = [title, "Active", req.user.userId];

    const optionalFields = {
      description,
      location,
      job_type,
      job_mode,
      industry,
      experience_level,
      education_level,
      number_of_positions,
      min_salary,
      max_salary,
      deadline,
    };

    for (const [col, val] of Object.entries(optionalFields)) {
      if (val !== undefined && val !== null && val !== "") {
        columns.push(col);
        values.push(val);
      }
    }

    if (employer_id && !is_anonymous) {
      columns.push("employer_id");
      values.push(employer_id);
    }

    if (is_anonymous) {
      columns.push("is_anonymous");
      values.push(true);
    }

    const placeholders = values.map((_, i) => `$${i + 1}`).join(", ");
    const result = await db.query(
      `INSERT INTO job_post (${columns.join(", ")}) VALUES (${placeholders}) RETURNING *`,
      values,
    );

    return res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating admin job post:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ─── Subscription Plans ──────────────────────────────────────
export const getPlans = async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM subscription_plans ORDER BY price ASC",
    );
    return res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching plans:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const createPlan = async (req, res) => {
  const { name, type, duration, price, job_post_limit, profile_access_limit } =
    req.body;

  if (!name || !type || !duration || price === undefined) {
    return res
      .status(400)
      .json({ message: "name, type, duration, and price are required" });
  }

  try {
    const result = await db.query(
      `INSERT INTO subscription_plans (name, type, duration, price, job_post_limit, profile_access_limit)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        name,
        type,
        duration,
        price,
        job_post_limit || null,
        profile_access_limit || null,
      ],
    );

    return res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating plan:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updatePlan = async (req, res) => {
  const { id } = req.params;
  const { name, type, duration, price, job_post_limit, profile_access_limit } =
    req.body;

  try {
    const updates = [];
    const values = [];
    let index = 1;

    if (name !== undefined) {
      updates.push(`name = $${index++}`);
      values.push(name);
    }
    if (type !== undefined) {
      updates.push(`type = $${index++}`);
      values.push(type);
    }
    if (duration !== undefined) {
      updates.push(`duration = $${index++}`);
      values.push(duration);
    }
    if (price !== undefined) {
      updates.push(`price = $${index++}`);
      values.push(price);
    }
    if (job_post_limit !== undefined) {
      updates.push(`job_post_limit = $${index++}`);
      values.push(job_post_limit);
    }
    if (profile_access_limit !== undefined) {
      updates.push(`profile_access_limit = $${index++}`);
      values.push(profile_access_limit);
    }

    if (updates.length === 0) {
      return res.status(400).json({ message: "No fields provided to update" });
    }

    values.push(id);

    const result = await db.query(
      `UPDATE subscription_plans SET ${updates.join(", ")} WHERE id = $${index} RETURNING *`,
      values,
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Plan not found" });
    }

    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error updating plan:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deletePlan = async (req, res) => {
  const { id } = req.params;

  try {
    const activeSubs = await db.query(
      "SELECT COUNT(*) AS count FROM subscriptions WHERE plan_id = $1 AND status = 'active' AND end_day >= CURRENT_DATE",
      [id],
    );

    if (parseInt(activeSubs.rows[0].count) > 0) {
      return res
        .status(409)
        .json({ message: "Cannot delete plan with active subscriptions" });
    }

    const result = await db.query(
      "DELETE FROM subscription_plans WHERE id = $1 RETURNING *",
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Plan not found" });
    }

    return res.status(200).json({ message: "Plan deleted successfully" });
  } catch (error) {
    console.error("Error deleting plan:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ─── Employer Subscriptions ──────────────────────────────────
export const getSubscriptions = async (req, res) => {
  const { status, plan_id, search, page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  try {
    const conditions = [];
    const values = [];
    let index = 1;

    if (status) {
      conditions.push(`s.status = $${index}`);
      values.push(status);
      index++;
    }

    if (plan_id) {
      conditions.push(`s.plan_id = $${index}`);
      values.push(plan_id);
      index++;
    }

    if (search) {
      conditions.push(`e.company_name ILIKE $${index}`);
      values.push(`%${search}%`);
      index++;
    }

    const whereClause =
      conditions.length > 0 ? "WHERE " + conditions.join(" AND ") : "";
    const limitIdx = index++;
    const offsetIdx = index++;
    values.push(Number(limit), offset);

    const result = await db.query(
      `SELECT
         s.*,
         sp.name AS plan_name, sp.type AS plan_type, sp.price AS plan_price,
         sp.job_post_limit AS plan_job_post_limit,
         sp.profile_access_limit AS plan_profile_access_limit,
         e.company_name, e.user_id AS employer_user_id,
         COALESCE(su.job_post_used, 0) AS job_post_used,
         COALESCE(su.profile_access_used, 0) AS profile_access_used,
         COUNT(*) OVER() AS total
       FROM subscriptions s
       INNER JOIN subscription_plans sp ON s.plan_id = sp.id
       INNER JOIN employers e ON s.employer_id = e.id
       LEFT JOIN subscription_usage su ON su.subscription_id = s.id
       ${whereClause}
       ORDER BY s.created_at DESC
       LIMIT $${limitIdx} OFFSET $${offsetIdx}`,
      values,
    );

    const total = result.rows.length > 0 ? Number(result.rows[0].total) : 0;
    const subscriptions = result.rows.map(({ total: _, ...row }) => row);

    return res
      .status(200)
      .json({ total, page: Number(page), limit: Number(limit), subscriptions });
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const changeSubscriptionStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = [
    "in-review",
    "active",
    "suspended",
    "paused",
    "cancelled",
  ];
  if (!status || !validStatuses.includes(status)) {
    return res
      .status(400)
      .json({
        message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
      });
  }

  try {
    const result = await db.query(
      "UPDATE subscriptions SET status = $1 WHERE id = $2 RETURNING *",
      [status, id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    return res
      .status(200)
      .json({ message: "Status updated", subscription: result.rows[0] });
  } catch (error) {
    console.error("Error changing subscription status:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const extendSubscription = async (req, res) => {
  const { id } = req.params;
  const { days } = req.body;

  if (!days || days <= 0) {
    return res.status(400).json({ message: "days must be a positive number" });
  }

  try {
    const result = await db.query(
      `UPDATE subscriptions
       SET end_day = end_day + INTERVAL '1 day' * $1
       WHERE id = $2
       RETURNING *`,
      [days, id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    return res
      .status(200)
      .json({
        message: `Subscription extended by ${days} days`,
        subscription: result.rows[0],
      });
  } catch (error) {
    console.error("Error extending subscription:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const assignCustomPlan = async (req, res) => {
  const { id } = req.params;
  const { custom_job_post_limit, custom_profile_access_limit } = req.body;

  try {
    const result = await db.query(
      `UPDATE subscriptions
       SET is_custom = true,
           custom_job_post_limit = $1,
           custom_profile_access_limit = $2
       WHERE id = $3
       RETURNING *`,
      [custom_job_post_limit, custom_profile_access_limit, id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    return res
      .status(200)
      .json({ message: "Custom plan assigned", subscription: result.rows[0] });
  } catch (error) {
    console.error("Error assigning custom plan:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ─── Profile Access Monitoring ───────────────────────────────
export const getProfileAccessRecords = async (req, res) => {
  const {
    employer_id,
    jobseeker_id,
    status: accessStatus,
    page = 1,
    limit = 10,
  } = req.query;
  const offset = (page - 1) * limit;

  try {
    const conditions = [];
    const values = [];
    let index = 1;

    if (employer_id) {
      conditions.push(`pa.employer = $${index}`);
      values.push(employer_id);
      index++;
    }

    if (jobseeker_id) {
      conditions.push(`pa.job_seeker = $${index}`);
      values.push(jobseeker_id);
      index++;
    }

    if (accessStatus === "active") {
      conditions.push("pa.expire_at > NOW()");
    } else if (accessStatus === "expired") {
      conditions.push("pa.expire_at <= NOW()");
    }

    const whereClause =
      conditions.length > 0 ? "WHERE " + conditions.join(" AND ") : "";
    const limitIdx = index++;
    const offsetIdx = index++;
    values.push(Number(limit), offset);

    const result = await db.query(
      `SELECT
         pa.id, pa.created_at, pa.expire_at,
         e.id AS employer_id, e.company_name,
         js.id AS jobseeker_id, js.first_name, js.last_name,
         js.professional_title, js.profile_image,
         CASE WHEN pa.expire_at > NOW() THEN 'active' ELSE 'expired' END AS access_status,
         COUNT(*) OVER() AS total
       FROM profile_access pa
       INNER JOIN employers e ON pa.employer = e.id
       INNER JOIN job_seeker js ON pa.job_seeker = js.id
       ${whereClause}
       ORDER BY pa.created_at DESC
       LIMIT $${limitIdx} OFFSET $${offsetIdx}`,
      values,
    );

    const total = result.rows.length > 0 ? Number(result.rows[0].total) : 0;
    const records = result.rows.map(({ total: _, ...row }) => row);

    return res
      .status(200)
      .json({ total, page: Number(page), limit: Number(limit), records });
  } catch (error) {
    console.error("Error fetching profile access records:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
