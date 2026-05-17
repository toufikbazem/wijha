import db from "../../config/db.js";
import bcryptjs from "bcryptjs";
import ExcelJS from "exceljs";

// ─── Dashboard ───────────────────────────────────────────────
export const getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsersResult,
      totalEmployersResult,
      totalJobSeekersResult,
      totalJobPostsResult,
      totalApplicationsResult,
      totalSubscriptionsResult,
      totalProfileAccessResult,
      jobPostsByStatusResult,
      activeSubscriptionsResult,
      newJobSeekersTodayResult,
      newEmployersTodayResult,
      newJobPostsTodayResult,
      newApplicationsTodayResult,
      newSubscriptionsTodayResult,
      newProfileAccessTodayResult,
      recentUsersResult,
      recentJobPostsResult,
    ] = await Promise.all([
      db.query("SELECT COUNT(*) AS count FROM users WHERE role != 'admin'"),
      db.query("SELECT COUNT(*) AS count FROM employers"),
      db.query("SELECT COUNT(*) AS count FROM job_seeker"),
      db.query(
        "SELECT COUNT(*) AS count FROM job_post WHERE status != 'Deleted'",
      ),
      db.query("SELECT COUNT(*) AS count FROM applications"),
      db.query("SELECT COUNT(*) AS count FROM subscriptions"),
      db.query("SELECT COUNT(*) AS count FROM profile_access"),
      db.query(
        `SELECT status, COUNT(*) AS count FROM job_post
         WHERE status != 'Deleted'
         GROUP BY status`,
      ),
      db.query(
        "SELECT COUNT(*) AS count FROM subscriptions WHERE status = 'active' AND end_day >= CURRENT_DATE",
      ),
      db.query(
        "SELECT COUNT(*) AS count FROM job_seeker WHERE DATE(created_at) = CURRENT_DATE",
      ),
      db.query(
        "SELECT COUNT(*) AS count FROM employers WHERE DATE(created_at) = CURRENT_DATE",
      ),
      db.query(
        "SELECT COUNT(*) AS count FROM job_post WHERE DATE(created_at) = CURRENT_DATE AND status != 'Deleted'",
      ),
      db.query(
        "SELECT COUNT(*) AS count FROM applications WHERE DATE(created_at) = CURRENT_DATE",
      ),
      db.query(
        "SELECT COUNT(*) AS count FROM subscriptions WHERE DATE(created_at) = CURRENT_DATE",
      ),
      db.query(
        "SELECT COUNT(*) AS count FROM profile_access WHERE DATE(created_at) = CURRENT_DATE",
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
      totalApplications: parseInt(totalApplicationsResult.rows[0].count),
      totalSubscriptions: parseInt(totalSubscriptionsResult.rows[0].count),
      totalProfileAccess: parseInt(totalProfileAccessResult.rows[0].count),
      newJobSeekersToday: parseInt(newJobSeekersTodayResult.rows[0].count),
      newEmployersToday: parseInt(newEmployersTodayResult.rows[0].count),
      newJobPostsToday: parseInt(newJobPostsTodayResult.rows[0].count),
      newApplicationsToday: parseInt(newApplicationsTodayResult.rows[0].count),
      newSubscriptionsToday: parseInt(
        newSubscriptionsTodayResult.rows[0].count,
      ),
      newProfileAccessToday: parseInt(
        newProfileAccessTodayResult.rows[0].count,
      ),
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

// Builds the shared WHERE + ORDER fragments for the job-seekers list.
// Used by both getJobSeekers (paginated) and exportJobSeekers (no pagination).
const buildJobSeekersQuery = (query) => {
  const {
    search,
    globalSearch,
    personalSearch,
    status,
    address,
    experience_level,
    education_level,
    gender,
    has_cv,
    is_email_verified,
    registered_type,
    joined_from,
    joined_to,
    sortBy = "latest",
  } = query;

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

  let globalSearchIdx = null;
  if (globalSearch) {
    globalSearchIdx = index;
    conditions.push(
      `(js.professional_title ILIKE $${index} OR js.skills::text ILIKE $${index} OR js.professional_summary ILIKE $${index})`,
    );
    values.push(`%${globalSearch}%`);
    index++;
  }

  let personalSearchIdx = null;
  if (personalSearch?.trim()) {
    personalSearchIdx = index;
    conditions.push(`
      (
        js.first_name ILIKE $${index}
        OR js.last_name ILIKE $${index}
        OR CONCAT(js.first_name, ' ', js.last_name) ILIKE $${index}
        OR COALESCE(u.email, js.user_email) ILIKE $${index}
      )
    `);
    values.push(`%${personalSearch.trim()}%`);
    index++;
  }

  if (status) {
    conditions.push(`js.status = $${index++}`);
    values.push(status);
  }
  if (address) {
    conditions.push(`js.address ILIKE $${index++}`);
    values.push(`%${address}%`);
  }
  if (experience_level) {
    conditions.push(`js.experience_level = $${index++}`);
    values.push(experience_level);
  }
  if (education_level) {
    conditions.push(`js.education_level = $${index++}`);
    values.push(education_level);
  }
  if (gender) {
    conditions.push(`js.gender = $${index++}`);
    values.push(gender);
  }
  if (has_cv === "true") {
    conditions.push("js.cv IS NOT NULL AND js.cv <> ''");
  } else if (has_cv === "false") {
    conditions.push("(js.cv IS NULL OR js.cv = '')");
  }
  if (is_email_verified === "true") {
    conditions.push("u.is_email_verified = true");
  } else if (is_email_verified === "false") {
    conditions.push(
      "(u.is_email_verified = false OR u.is_email_verified IS NULL)",
    );
  }
  if (registered_type === "registered") {
    conditions.push("js.user_id IS NOT NULL");
  } else if (registered_type === "admin_created") {
    conditions.push("js.user_id IS NULL");
  }
  if (joined_from) {
    conditions.push(`COALESCE(u.created_at, js.created_at) >= $${index++}`);
    values.push(joined_from);
  }
  if (joined_to) {
    conditions.push(`COALESCE(u.created_at, js.created_at) <= $${index++}`);
    values.push(joined_to);
  }

  const whereClause =
    conditions.length > 0 ? "WHERE " + conditions.join(" AND ") : "";

  const orderParts = [];
  if (globalSearchIdx !== null) {
    orderParts.push(
      `CASE WHEN js.professional_title ILIKE $${globalSearchIdx} THEN 0 ELSE 1 END`,
    );
  }
  if (personalSearchIdx !== null) {
    orderParts.push(
      `CASE WHEN js.first_name ILIKE $${personalSearchIdx} OR js.last_name ILIKE $${personalSearchIdx} THEN 0 ELSE 1 END`,
    );
  }
  orderParts.push(
    sortBy === "oldest"
      ? "COALESCE(u.created_at, js.created_at) ASC"
      : "COALESCE(u.created_at, js.created_at) DESC",
  );
  const orderClause = orderParts.join(", ");

  return { whereClause, orderClause, values, nextIndex: index };
};

export const getJobSeekers = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  try {
    const { whereClause, orderClause, values, nextIndex } =
      buildJobSeekersQuery(req.query);

    const limitIdx = nextIndex;
    const offsetIdx = nextIndex + 1;
    values.push(Number(limit), offset);

    const result = await db.query(
      `SELECT
         js.id AS jobseeker_id,
         js.first_name, js.last_name,
         js.professional_title, js.phone_number, js.address, js.status,
         js.profile_image, js.user_email,
         js.gender, js.experience_level, js.education_level,
         js.user_id,
         CASE WHEN js.cv IS NOT NULL AND js.cv <> '' THEN true ELSE false END AS has_cv,
         COALESCE(u.email, js.user_email) AS email,
         u.role, u.is_email_verified,
         COALESCE(u.created_at, js.created_at) AS created_at,
         CASE WHEN js.user_id IS NULL THEN true ELSE false END AS is_admin_created,
         COUNT(*) OVER() AS total
       FROM job_seeker js
       LEFT JOIN users u ON js.user_id = u.id
       ${whereClause}
       ORDER BY ${orderClause}
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

const EXPORT_BATCH_SIZE = 1000;

const formatExportRow = (row) => {
  const fullName = [row.first_name, row.last_name].filter(Boolean).join(" ");
  return {
    name: fullName || "—",
    email: row.email || "—",
    professionalTitle: row.professional_title || "",
    phone: row.phone_number || "",
    address: row.address || "",
    gender: row.gender || "",
    experienceLevel: row.experience_level || "",
    educationLevel: row.education_level || "",
    status: row.status || "",
    emailVerified: row.is_email_verified ? "Yes" : "No",
    hasCv: row.has_cv ? "Yes" : "No",
    registeredType: row.is_admin_created ? "Admin-created" : "Self-registered",
    createdAt: row.created_at
      ? new Date(row.created_at).toISOString().replace("T", " ").slice(0, 19)
      : "",
  };
};

export const exportJobSeekers = async (req, res) => {
  try {
    const { whereClause, orderClause, values, nextIndex } =
      buildJobSeekersQuery(req.query);

    const stamp = new Date().toISOString().slice(0, 10);
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="job-seekers-${stamp}.xlsx"`,
    );

    const workbook = new ExcelJS.stream.xlsx.WorkbookWriter({
      stream: res,
      useStyles: true,
    });
    const sheet = workbook.addWorksheet("Job Seekers");

    sheet.columns = [
      { header: "Name", key: "name", width: 28 },
      { header: "Email", key: "email", width: 32 },
      { header: "Professional Title", key: "professionalTitle", width: 26 },
      { header: "Phone", key: "phone", width: 18 },
      { header: "Address", key: "address", width: 28 },
      { header: "Gender", key: "gender", width: 12 },
      { header: "Experience Level", key: "experienceLevel", width: 18 },
      { header: "Education Level", key: "educationLevel", width: 18 },
      { header: "Status", key: "status", width: 14 },
      { header: "Email Verified", key: "emailVerified", width: 14 },
      { header: "Has CV", key: "hasCv", width: 10 },
      { header: "Registered Type", key: "registeredType", width: 18 },
      { header: "Created At", key: "createdAt", width: 22 },
    ];
    sheet.getRow(1).font = { bold: true };
    sheet.getRow(1).commit();

    // Stream rows in fixed-size batches with LIMIT/OFFSET against the same
    // WHERE/ORDER as the on-screen list, so memory stays flat even at 100k+ rows.
    let offset = 0;
    // Reserve the next two placeholders for LIMIT/OFFSET. Their indices are
    // stable across iterations; only the bound values change.
    const limitIdx = nextIndex;
    const offsetIdx = nextIndex + 1;
    values.push(EXPORT_BATCH_SIZE, offset);

    while (true) {
      values[values.length - 2] = EXPORT_BATCH_SIZE;
      values[values.length - 1] = offset;

      const batch = await db.query(
        `SELECT
           js.first_name, js.last_name,
           js.professional_title, js.phone_number, js.address, js.status,
           js.gender, js.experience_level, js.education_level,
           CASE WHEN js.cv IS NOT NULL AND js.cv <> '' THEN true ELSE false END AS has_cv,
           COALESCE(u.email, js.user_email) AS email,
           u.is_email_verified,
           COALESCE(u.created_at, js.created_at) AS created_at,
           CASE WHEN js.user_id IS NULL THEN true ELSE false END AS is_admin_created
         FROM job_seeker js
         LEFT JOIN users u ON js.user_id = u.id
         ${whereClause}
         ORDER BY ${orderClause}
         LIMIT $${limitIdx} OFFSET $${offsetIdx}`,
        values,
      );

      for (const row of batch.rows) {
        sheet.addRow(formatExportRow(row)).commit();
      }

      if (batch.rows.length < EXPORT_BATCH_SIZE) break;
      offset += EXPORT_BATCH_SIZE;
    }

    await sheet.commit();
    await workbook.commit();
  } catch (error) {
    console.error("Error exporting job seekers:", error);
    // Headers may already be sent (streaming response); only respond JSON if not.
    if (!res.headersSent) {
      return res.status(500).json({ message: "Internal server error" });
    }
    res.end();
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
    return res.status(400).json({
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

export const updateJobSeeker = async (req, res) => {
  const { id } = req.params;
  const allowed = [
    "first_name",
    "last_name",
    "professional_title",
    "phone_number",
    "address",
    "gender",
    "experience_level",
    "education_level",
    "professional_summary",
    "skills",
    "linkedin",
    "github",
    "portfolio",
    "profile_image",
    "cv",
  ];

  const updates = [];
  const values = [];
  let index = 1;

  for (const field of allowed) {
    if (req.body[field] !== undefined) {
      updates.push(`${field} = $${index++}`);
      values.push(req.body[field]);
    }
  }

  if (updates.length === 0) {
    return res.status(400).json({ message: "No fields provided to update" });
  }

  values.push(id);

  try {
    const result = await db.query(
      `UPDATE job_seeker SET ${updates.join(", ")} WHERE id = $${index} RETURNING *`,
      values,
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Job seeker not found" });
    }

    return res
      .status(200)
      .json({ message: "Profile updated", jobSeeker: result.rows[0] });
  } catch (error) {
    console.error("Error updating job seeker:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getJobSeekerApplications = async (req, res) => {
  const { id } = req.params;
  const { page = 1, limit = 10 } = req.query;
  const offset = (Number(page) - 1) * Number(limit);

  try {
    const result = await db.query(
      `SELECT
         a.id AS application_id,
         a.created_at AS applied_at,
         jp.id AS job_post_id,
         jp.title,
         jp.status AS job_status,
         jp.location,
         jp.job_type,
         e.id AS employer_id,
         e.company_name,
         e.logo,
         COUNT(*) OVER() AS total
       FROM applications a
       INNER JOIN job_post jp ON a.job_post = jp.id
       LEFT JOIN employers e ON jp.employer_id = e.id
       WHERE a.jobseeker = $1
       ORDER BY a.created_at DESC
       LIMIT $2 OFFSET $3`,
      [id, Number(limit), offset],
    );

    const total = result.rows.length > 0 ? Number(result.rows[0].total) : 0;
    const applications = result.rows.map(({ total: _, ...row }) => row);

    return res
      .status(200)
      .json({ total, page: Number(page), limit: Number(limit), applications });
  } catch (error) {
    console.error("Error fetching job seeker applications:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteJobSeekerApplication = async (req, res) => {
  const { id, applicationId } = req.params;

  try {
    const result = await db.query(
      "SELECT job_post FROM applications WHERE id = $1 AND jobseeker = $2",
      [applicationId, id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Application not found" });
    }

    const jobPostId = result.rows[0].job_post;

    await db.query("DELETE FROM applications WHERE id = $1", [applicationId]);
    await db.query(
      "UPDATE job_post SET applicants = GREATEST(COALESCE(applicants, 0) - 1, 0) WHERE id = $1",
      [jobPostId],
    );

    return res.status(200).json({ message: "Application deleted" });
  } catch (error) {
    console.error("Error deleting application:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getJobSeekerSavedJobs = async (req, res) => {
  const { id } = req.params;
  const { page = 1, limit = 10 } = req.query;
  const offset = (Number(page) - 1) * Number(limit);

  try {
    const result = await db.query(
      `SELECT
         sj.id AS saved_id,
         sj.created_at AS saved_at,
         jp.id AS job_post_id,
         jp.title,
         jp.status AS job_status,
         jp.location,
         jp.job_type,
         e.id AS employer_id,
         e.company_name,
         e.logo,
         COUNT(*) OVER() AS total
       FROM saved_jobs sj
       INNER JOIN job_post jp ON sj.job_post = jp.id
       LEFT JOIN employers e ON jp.employer_id = e.id
       WHERE sj.job_seeker = $1
       ORDER BY sj.created_at DESC
       LIMIT $2 OFFSET $3`,
      [id, Number(limit), offset],
    );

    const total = result.rows.length > 0 ? Number(result.rows[0].total) : 0;
    const savedJobs = result.rows.map(({ total: _, ...row }) => row);

    return res
      .status(200)
      .json({ total, page: Number(page), limit: Number(limit), savedJobs });
  } catch (error) {
    console.error("Error fetching saved jobs:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteJobSeekerSavedJob = async (req, res) => {
  const { id, savedId } = req.params;

  try {
    const result = await db.query(
      "DELETE FROM saved_jobs WHERE id = $1 AND job_seeker = $2 RETURNING id",
      [savedId, id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Saved job not found" });
    }

    return res.status(200).json({ message: "Saved job removed" });
  } catch (error) {
    console.error("Error deleting saved job:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const changeJobSeekerStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ["active", "deactivated", "unverified", "suspended"];
  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({
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
  const {
    search,
    globalSearch,
    status,
    address,
    industry,
    is_email_verified,
    joined_from,
    joined_to,
    sortBy = "latest",
    page = 1,
    limit = 10,
  } = req.query;

  const offset = (page - 1) * limit;

  try {
    const conditions = ["u.role = 'employer'"];
    const values = [];
    let index = 1;

    const searchParam = search || globalSearch;

    let searchIdx = null;

    if (searchParam) {
      searchIdx = index;

      conditions.push(`
        (
          e.company_name ILIKE $${index}
          OR u.email ILIKE $${index}
          OR e.description ILIKE $${index}
          OR e.missions::text ILIKE $${index}
        )
      `);

      values.push(`%${searchParam}%`);
      index++;
    }

    if (status) {
      conditions.push(`e.status = $${index++}`);
      values.push(status);
    }

    if (address) {
      conditions.push(`e.address ILIKE $${index++}`);
      values.push(`%${address}%`);
    }

    if (industry) {
      conditions.push(`e.industry = $${index++}`);
      values.push(industry);
    }

    if (is_email_verified === "true") {
      conditions.push("u.is_email_verified = true");
    } else if (is_email_verified === "false") {
      conditions.push(
        "(u.is_email_verified = false OR u.is_email_verified IS NULL)",
      );
    }

    if (joined_from) {
      conditions.push(`u.created_at >= $${index++}`);
      values.push(joined_from);
    }

    if (joined_to) {
      conditions.push(`u.created_at <= $${index++}`);
      values.push(joined_to);
    }

    const whereClause = conditions.join(" AND ");

    const orderParts = [];

    if (searchIdx !== null) {
      orderParts.push(`
        CASE
          WHEN e.company_name ILIKE $${searchIdx} THEN 0
          WHEN u.email ILIKE $${searchIdx} THEN 1
          WHEN e.description ILIKE $${searchIdx} THEN 2
          WHEN e.missions::text ILIKE $${searchIdx} THEN 3
          ELSE 4
        END
      `);
    }

    orderParts.push(
      sortBy === "oldest" ? "u.created_at ASC" : "u.created_at DESC",
    );

    const orderClause = orderParts.join(", ");

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
       ORDER BY ${orderClause}
       LIMIT $${limitIdx} OFFSET $${offsetIdx}`,
      values,
    );

    const total = result.rows.length > 0 ? Number(result.rows[0].total) : 0;

    const employers = result.rows.map(({ total: _, ...row }) => row);

    return res.status(200).json({
      total,
      page: Number(page),
      limit: Number(limit),
      employers,
    });
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

export const updateEmployer = async (req, res) => {
  const { id } = req.params;
  const allowed = [
    "company_name",
    "industry",
    "size",
    "address",
    "phone_number",
    "founding_year",
    "website",
    "linkedin",
    "description",
    "missions",
    "logo",
  ];

  const updates = [];
  const values = [];
  let index = 1;

  for (const field of allowed) {
    if (req.body[field] !== undefined) {
      updates.push(`${field} = $${index++}`);
      values.push(req.body[field]);
    }
  }

  if (updates.length === 0) {
    return res.status(400).json({ message: "No fields provided to update" });
  }

  values.push(id);

  try {
    const result = await db.query(
      `UPDATE employers SET ${updates.join(", ")} WHERE user_id = $${index} RETURNING *`,
      values,
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Employer not found" });
    }

    return res
      .status(200)
      .json({ message: "Employer updated", employer: result.rows[0] });
  } catch (error) {
    console.error("Error updating employer:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getEmployerProfileAccess = async (req, res) => {
  const { id } = req.params;
  const { page = 1, limit = 10, status: accessStatus } = req.query;
  const offset = (Number(page) - 1) * Number(limit);

  try {
    const empResult = await db.query(
      "SELECT id FROM employers WHERE user_id = $1",
      [id],
    );

    if (empResult.rows.length === 0) {
      return res.status(404).json({ message: "Employer not found" });
    }

    const employerId = empResult.rows[0].id;
    const conditions = ["pa.employer = $1"];
    const values = [employerId];
    let index = 2;

    if (accessStatus === "active") {
      conditions.push("pa.expire_at > NOW()");
    } else if (accessStatus === "expired") {
      conditions.push("pa.expire_at <= NOW()");
    }

    const limitIdx = index++;
    const offsetIdx = index++;
    values.push(Number(limit), offset);

    const result = await db.query(
      `SELECT
         pa.id, pa.created_at, pa.expire_at,
         js.id AS jobseeker_id, js.first_name, js.last_name,
         js.professional_title, js.profile_image,
         CASE WHEN pa.expire_at > NOW() THEN 'active' ELSE 'expired' END AS access_status,
         COUNT(*) OVER() AS total
       FROM profile_access pa
       INNER JOIN job_seeker js ON pa.job_seeker = js.id
       WHERE ${conditions.join(" AND ")}
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
    console.error("Error fetching employer profile access:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getEmployerSubscription = async (req, res) => {
  const { id } = req.params;

  try {
    const empResult = await db.query(
      "SELECT id FROM employers WHERE user_id = $1",
      [id],
    );

    if (empResult.rows.length === 0) {
      return res.status(404).json({ message: "Employer not found" });
    }

    const employerId = empResult.rows[0].id;

    const result = await db.query(
      `SELECT
         s.*,
         sp.name AS plan_name, sp.type AS plan_type, sp.price AS plan_price,
         sp.duration AS plan_duration,
         sp.job_post_limit AS plan_job_post_limit,
         sp.profile_access_limit AS plan_profile_access_limit,
         COALESCE(su.job_post_used, 0) AS job_post_used,
         COALESCE(su.profile_access_used, 0) AS profile_access_used
       FROM subscriptions s
       INNER JOIN subscription_plans sp ON s.plan_id = sp.id
       LEFT JOIN subscription_usage su ON su.subscription_id = s.id
       WHERE s.employer_id = $1
       ORDER BY s.created_at DESC`,
      [employerId],
    );

    return res.status(200).json({ subscriptions: result.rows });
  } catch (error) {
    console.error("Error fetching employer subscription:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const changeEmployerStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ["active", "suspended", "unverified", "deactivated"];
  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({
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
    globalSearch,
    status,
    employer_id,
    address,
    industry,
    experience_level,
    education_level,
    job_type,
    job_mode,
    is_anonymous,
    created_from,
    created_to,
    sortBy = "latest",
    page = 1,
    limit = 10,
  } = req.query;

  const offset = (page - 1) * limit;

  try {
    const conditions = [];
    const values = [];
    let index = 1;

    // Legacy single search box (kept for backwards compatibility).
    if (search) {
      conditions.push(
        `(jp.title ILIKE $${index} OR e.company_name ILIKE $${index})`,
      );
      values.push(`%${search}%`);
      index++;
    }

    // Global search: job title + description + company name.
    let globalSearchIdx = null;
    if (globalSearch) {
      globalSearchIdx = index;
      conditions.push(
        `(jp.title ILIKE $${index} OR jp.description ILIKE $${index} OR e.company_name ILIKE $${index})`,
      );
      values.push(`%${globalSearch}%`);
      index++;
    }

    if (status) {
      conditions.push(`jp.status = $${index++}`);
      values.push(status);
    }

    if (employer_id) {
      conditions.push(`jp.employer_id = $${index++}`);
      values.push(employer_id);
    }

    if (address) {
      conditions.push(`jp.location ILIKE $${index++}`);
      values.push(`%${address}%`);
    }

    if (industry) {
      conditions.push(`jp.industry = $${index++}`);
      values.push(industry);
    }

    if (experience_level) {
      conditions.push(`jp.experience_level = $${index++}`);
      values.push(experience_level);
    }

    if (education_level) {
      conditions.push(`jp.education_level = $${index++}`);
      values.push(education_level);
    }

    if (job_type) {
      conditions.push(`jp.job_type = $${index++}`);
      values.push(job_type);
    }

    if (job_mode) {
      conditions.push(`jp.job_mode = $${index++}`);
      values.push(job_mode);
    }

    if (is_anonymous === "true") {
      conditions.push("jp.is_anonymous = true");
    } else if (is_anonymous === "false") {
      conditions.push("(jp.is_anonymous = false OR jp.is_anonymous IS NULL)");
    }

    if (created_from) {
      conditions.push(`jp.created_at >= $${index++}`);
      values.push(created_from);
    }

    if (created_to) {
      conditions.push(`jp.created_at <= $${index++}`);
      values.push(created_to);
    }

    conditions.unshift("jp.status != 'Deleted'");
    const whereClause = "WHERE " + conditions.join(" AND ");

    // Search-priority ordering: title match first, then description, then company.
    const orderParts = [];
    if (globalSearchIdx !== null) {
      orderParts.push(
        `CASE
           WHEN jp.title ILIKE $${globalSearchIdx} THEN 0
           WHEN jp.description ILIKE $${globalSearchIdx} THEN 1
           WHEN e.company_name ILIKE $${globalSearchIdx} THEN 2
           ELSE 3
         END`,
      );
    }
    orderParts.push(
      sortBy === "oldest" ? "jp.created_at ASC" : "jp.created_at DESC",
    );
    const orderClause = orderParts.join(", ");

    const limitIdx = index++;
    const offsetIdx = index++;
    values.push(Number(limit), offset);

    const result = await db.query(
      `SELECT
         jp.id, jp.title, jp.status, jp.status_reason, jp.location, jp.job_type, jp.job_mode,
         jp.industry, jp.education_level, jp.experience_level, jp.is_anonymous,
         jp.created_at, jp.deadline, jp.applicants,
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

  const validStatuses = [
    "Draft",
    "Active",
    "In-review",
    "Pending",
    "Paused",
    "Rejected",
    "Expired",
    "Deleted",
  ];

  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({
      message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
    });
  }

  const requiresReason = ["Pending", "Rejected"];
  if (requiresReason.includes(status) && !status_reason?.trim()) {
    return res.status(400).json({
      message:
        "A reason is required when setting status to Pending or Rejected",
    });
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

export const updateJobPostByAdmin = async (req, res) => {
  const { id } = req.params;
  const {
    title,
    description,
    location,
    industry,
    job_type,
    job_mode,
    experience_level,
    education_level,
    min_salary,
    max_salary,
    deadline,
    number_of_positions,
    is_anonymous,
  } = req.body;

  if (deadline) {
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);
    if (new Date(deadline) > maxDate) {
      return res
        .status(400)
        .json({ message: "Deadline cannot be more than 3 months from now" });
    }
  }

  const updates = [];
  const values = [];

  const setIfDefined = (col, val) => {
    if (val !== undefined) {
      updates.push(col);
      values.push(val === "" ? null : val);
    }
  };

  setIfDefined("title", title);
  setIfDefined("description", description);
  setIfDefined("location", location);
  setIfDefined("industry", industry);
  setIfDefined("job_type", job_type);
  setIfDefined("job_mode", job_mode);
  setIfDefined("experience_level", experience_level);
  setIfDefined("education_level", education_level);
  setIfDefined("min_salary", min_salary);
  setIfDefined("max_salary", max_salary);
  setIfDefined("deadline", deadline);
  setIfDefined("number_of_positions", number_of_positions);
  setIfDefined("is_anonymous", is_anonymous);

  if (updates.length === 0) {
    return res.status(400).json({ message: "No fields provided to update" });
  }

  try {
    const setClause = updates.map((col, i) => `${col} = $${i + 1}`).join(", ");
    const result = await db.query(
      `UPDATE job_post SET ${setClause} WHERE id = $${updates.length + 1} RETURNING *`,
      [...values, id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Job post not found" });
    }

    return res
      .status(200)
      .json({ message: "Job post updated", jobPost: result.rows[0] });
  } catch (error) {
    console.error("Error updating job post:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteJobPost = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(
      "DELETE FROM job_post WHERE id = $1 RETURNING id",
      [id],
    );
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
    return res.status(400).json({
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

    return res.status(200).json({
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

// ─── User Account Management ─────────────────────────────────
export const updateUserEmail = async (req, res) => {
  const { id } = req.params;
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  try {
    const existing = await db.query(
      "SELECT id FROM users WHERE email = $1 AND id != $2",
      [email, id],
    );
    if (existing.rows.length > 0) {
      return res.status(409).json({ message: "Email already in use" });
    }

    const result = await db.query(
      "UPDATE users SET email = $1, is_email_verified = false WHERE id = $2 RETURNING id, email, role, is_email_verified",
      [email, id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    return res
      .status(200)
      .json({ message: "Email updated", user: result.rows[0] });
  } catch (error) {
    console.error("Error updating user email:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateUserPassword = async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;

  if (!password || password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters" });
  }

  try {
    const hashed = bcryptjs.hashSync(password, 10);
    const result = await db.query(
      "UPDATE users SET password = $1 WHERE id = $2 RETURNING id",
      [hashed, id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "Password updated" });
  } catch (error) {
    console.error("Error updating user password:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateEmailVerification = async (req, res) => {
  const { id } = req.params;
  const { verified } = req.body;

  if (typeof verified !== "boolean") {
    return res.status(400).json({ message: "verified must be a boolean" });
  }

  try {
    const result = await db.query(
      "UPDATE users SET is_email_verified = $1 WHERE id = $2 RETURNING id, email, is_email_verified",
      [verified, id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    return res
      .status(200)
      .json({ message: "Verification state updated", user: result.rows[0] });
  } catch (error) {
    console.error("Error updating email verification:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ─── Global Applications List ────────────────────────────────
export const getApplications = async (req, res) => {
  const {
    search,
    status,
    job_post_id,
    applied_in,
    sortBy,
    page = 1,
    limit = 10,
  } = req.query;
  const offset = (Number(page) - 1) * Number(limit);

  try {
    const conditions = [];
    const values = [];
    let index = 1;

    if (search) {
      conditions.push(
        `(jp.title ILIKE $${index} OR e.company_name ILIKE $${index} OR js.first_name ILIKE $${index} OR js.last_name ILIKE $${index} OR COALESCE(u.email, js.user_email) ILIKE $${index})`,
      );
      values.push(`%${search}%`);
      index++;
    }

    if (status) {
      conditions.push(`a.status = $${index++}`);
      values.push(status);
    }

    if (job_post_id) {
      conditions.push(`a.job_post = $${index++}`);
      values.push(job_post_id);
    }

    // Time-window filter on application date
    const AppliedInIntervals = {
      hour: "1 hour",
      day: "24 hours",
      week: "7 days",
      month: "30 days",
    };
    if (applied_in && AppliedInIntervals[applied_in]) {
      conditions.push(
        `a.created_at >= NOW() - INTERVAL '${AppliedInIntervals[applied_in]}'`,
      );
    }

    const whereClause =
      conditions.length > 0 ? "WHERE " + conditions.join(" AND ") : "";

    const orderDirection = sortBy === "oldest" ? "ASC" : "DESC";

    const limitIdx = index++;
    const offsetIdx = index++;
    values.push(Number(limit), offset);

    const result = await db.query(
      `SELECT
         a.id AS application_id,
         a.status,
         a.created_at AS applied_at,
         jp.id AS job_post_id,
         jp.title AS job_title,
         jp.status AS job_status,
         e.user_id AS employer_id,
         e.company_name,
         e.logo,
         js.id AS jobseeker_id,
         js.first_name,
         js.last_name,
         js.professional_title,
         js.profile_image,
         js.status AS seeker_status,
         COALESCE(u.email, js.user_email) AS seeker_email,
         COUNT(*) OVER() AS total
       FROM applications a
       INNER JOIN job_post jp ON a.job_post = jp.id
       LEFT JOIN employers e ON jp.employer_id = e.id
       INNER JOIN job_seeker js ON a.jobseeker = js.id
       LEFT JOIN users u ON js.user_id = u.id
       ${whereClause}
       ORDER BY a.created_at ${orderDirection}
       LIMIT $${limitIdx} OFFSET $${offsetIdx}`,
      values,
    );

    const total = result.rows.length > 0 ? Number(result.rows[0].total) : 0;
    const applications = result.rows.map(({ total: _, ...row }) => row);
    const totalPages = Math.max(1, Math.ceil(total / Number(limit)));

    return res.status(200).json({
      total,
      page: Number(page),
      limit: Number(limit),
      applications,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages,
      },
    });
  } catch (error) {
    console.error("Error fetching global applications:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteApplication = async (req, res) => {
  const { applicationId } = req.params;

  try {
    const result = await db.query(
      "SELECT job_post FROM applications WHERE id = $1",
      [applicationId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Application not found" });
    }

    const jobPostId = result.rows[0].job_post;

    await db.query("DELETE FROM applications WHERE id = $1", [applicationId]);
    await db.query(
      "UPDATE job_post SET applicants = GREATEST(COALESCE(applicants, 0) - 1, 0) WHERE id = $1",
      [jobPostId],
    );

    return res.status(200).json({ message: "Application deleted" });
  } catch (error) {
    console.error("Error deleting application:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ─── Create Subscription Manually ────────────────────────────
export const createSubscription = async (req, res) => {
  const {
    employer_id,
    plan_id,
    start_day,
    end_day,
    status = "active",
  } = req.body;

  if (!employer_id || !plan_id) {
    return res
      .status(400)
      .json({ message: "employer_id and plan_id are required" });
  }

  try {
    const emp = await db.query("SELECT id FROM employers WHERE id = $1", [
      employer_id,
    ]);
    if (emp.rows.length === 0) {
      return res.status(404).json({ message: "Employer not found" });
    }

    const plan = await db.query(
      "SELECT id, duration FROM subscription_plans WHERE id = $1",
      [plan_id],
    );
    if (plan.rows.length === 0) {
      return res.status(404).json({ message: "Plan not found" });
    }

    const startDate = start_day || new Date().toISOString().split("T")[0];
    let endDate = end_day;
    if (!endDate) {
      const start = new Date(startDate);
      start.setDate(start.getDate() + Number(plan.rows[0].duration || 30));
      endDate = start.toISOString().split("T")[0];
    }

    const subResult = await db.query(
      `INSERT INTO subscriptions (employer_id, plan_id, start_day, end_day, status)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [employer_id, plan_id, startDate, endDate, status],
    );

    const subscription = subResult.rows[0];

    await db.query(
      `INSERT INTO subscription_usage (subscription_id, job_post_used, profile_access_used)
       VALUES ($1, 0, 0)`,
      [subscription.id],
    );

    return res.status(201).json(subscription);
  } catch (error) {
    console.error("Error creating subscription:", error);
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
