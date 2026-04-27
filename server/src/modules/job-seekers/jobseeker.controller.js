import db from "../../config/db.js";

export const getJobSeekerProfile = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Job seeker ID is required" });
  }

  try {
    // Resolve the job_seeker record: id can be job_seeker.id (from employers)
    // or users.id (from jobseekers viewing their own profile)
    let profileResult = await db.query(
      `SELECT js.*, COALESCE(u.email, js.user_email) AS email
       FROM job_seeker js
       LEFT JOIN users u ON js.user_id = u.id
       WHERE js.id = $1`,
      [id],
    );

    // If not found by job_seeker.id, try by user_id (for jobseekers with accounts)
    if (profileResult.rows.length === 0) {
      profileResult = await db.query(
        `SELECT js.*, COALESCE(u.email, js.user_email) AS email
         FROM job_seeker js
         LEFT JOIN users u ON js.user_id = u.id
         WHERE js.user_id = $1`,
        [id],
      );
    }

    if (profileResult.rows.length === 0) {
      return res.status(404).json({ message: "Job seeker not found" });
    }

    const jobSeekerProfile = profileResult.rows[0];
    const jobSeekerId = jobSeekerProfile.id;

    // If the requester is an employer, verify they have active profile_access
    if (req.user.role === "employer") {
      const employerResult = await db.query(
        "SELECT id FROM employers WHERE user_id = $1",
        [req.user.userId],
      );

      if (employerResult.rows.length === 0) {
        return res.status(403).json({ message: "Employer not found" });
      }

      const accessResult = await db.query(
        `SELECT id FROM profile_access
         WHERE employer = $1 AND job_seeker = $2 AND expire_at > NOW()`,
        [employerResult.rows[0].id, jobSeekerId],
      );

      if (accessResult.rows.length === 0) {
        return res
          .status(403)
          .json({ message: "You do not have access to this profile" });
      }
    }

    const [experience, education, languages] = await Promise.all([
      db.query("SELECT * FROM experiences WHERE user_id = $1", [jobSeekerId]),
      db.query("SELECT * FROM educations WHERE user_id = $1", [jobSeekerId]),
      db.query("SELECT * FROM languages WHERE user_id = $1", [jobSeekerId]),
    ]);

    return res.status(200).json({
      ...jobSeekerProfile,
      experiences: experience.rows,
      educations: education.rows,
      languages: languages.rows,
    });
  } catch (error) {
    console.error("Error fetching job seeker profile:", error);
    return res
      .status(500)
      .json({ message: "Error fetching job seeker profile" });
  }
};

export const updateJobSeekerProfile = async (req, res) => {
  const { id } = req.params;
  const {
    first_name,
    last_name,
    professional_title,
    gender,
    address,
    phone_number,
    profile_image,
    professional_summary,
    experience_level,
    education_level,
    cv,
    skills,
    linkedin,
    github,
    portfolio,
  } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Job seeker ID is required" });
  }

  // if (req.user.role !== "jobseeker" || req.user.id !== id) {
  //   return res
  //     .status(403)
  //     .json({ message: "You are not authorized to update this profile" });
  // }

  const userResult = await db.query(
    "SELECT id, status FROM job_seeker WHERE id = $1",
    [id],
  );
  if (
    userResult.rows[0].status !== "active" &&
    userResult.rows[0].status !== "unverified"
  ) {
    return res.status(403).json({
      error_code: "ACCOUNT_INACTIVE",
      message: "Your account is inactive, please contact support.",
    });
  }

  const values = [];
  const updates = [];
  let index = 1;
  if (first_name) {
    updates.push(`first_name = $${index++}`);
    values.push(first_name);
  }
  if (last_name) {
    updates.push(`last_name = $${index++}`);
    values.push(last_name);
  }
  if (professional_title) {
    updates.push(`professional_title = $${index++}`);
    values.push(professional_title);
  }
  if (gender) {
    updates.push(`gender = $${index++}`);
    values.push(gender);
  }

  if (address) {
    updates.push(`address = $${index++}`);
    values.push(address);
  }
  if (phone_number) {
    updates.push(`phone_number = $${index++}`);
    values.push(phone_number);
  }
  if (profile_image) {
    updates.push(`profile_image = $${index++}`);
    values.push(profile_image);
  }
  if (professional_summary) {
    updates.push(`professional_summary = $${index++}`);
    values.push(professional_summary);
  }
  if (experience_level) {
    updates.push(`experience_level = $${index++}`);
    values.push(experience_level);
  }
  if (education_level) {
    updates.push(`education_level = $${index++}`);
    values.push(education_level);
  }
  if (cv) {
    updates.push(`cv = $${index++}`);
    values.push(cv);
  }
  if (skills && skills.length > 0) {
    updates.push(`skills = $${index++}`);
    values.push(skills);
  }
  if (linkedin) {
    updates.push(`linkedin = $${index++}`);
    values.push(linkedin);
  }
  if (github) {
    updates.push(`github = $${index++}`);
    values.push(github);
  }
  if (portfolio) {
    updates.push(`portfolio = $${index++}`);
    values.push(portfolio);
  }

  if (updates.length === 0) {
    return res.status(400).json({ message: "No fields to update" });
  }

  try {
    const query = `UPDATE job_seeker SET ${updates.join(", ")} WHERE id = $${index} RETURNING *`;
    values.push(id);

    const result = await db.query(query, values);

    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error updating job seeker profile:", error);
    return res
      .status(500)
      .json({ message: "Error updating job seeker profile" });
  }
};

export const getDashboardStats = async (req, res) => {
  const userId = req.user.userId;

  try {
    // Get the job seeker record
    const jobseeker = await db.query(
      "SELECT id FROM job_seeker WHERE user_id = $1",
      [userId],
    );

    if (!jobseeker.rows.length) {
      return res.status(404).json({ message: "Job seeker not found" });
    }

    const jobseekerId = jobseeker.rows[0].id;

    // Run all queries in parallel
    const [
      totalApplicationsResult,
      savedCountResult,
      recentApplicationsResult,
    ] = await Promise.all([
      // Total applications
      db.query(
        "SELECT COUNT(*) AS count FROM applications WHERE jobseeker = $1",
        [jobseekerId],
      ),
      // Saved jobs count
      db.query(
        "SELECT COUNT(*) AS count FROM saved_jobs WHERE job_seeker = $1",
        [jobseekerId],
      ),
      // Recent 5 applications with job details
      db.query(
        `SELECT
           a.id AS application_id,
           a.created_at AS applied_at,
           jp.id AS job_post_id,
           jp.title,
           jp.location,
           jp.job_type,
           jp.status AS job_status,
           e.company_name,
           e.logo
         FROM applications a
         INNER JOIN job_post jp ON a.job_post = jp.id
         INNER JOIN employers e ON jp.employer_id = e.id
         WHERE a.jobseeker = $1
         ORDER BY a.created_at DESC LIMIT 5`,
        [jobseekerId],
      ),
    ]);

    return res.status(200).json({
      totalApplications: parseInt(totalApplicationsResult.rows[0].count),
      savedJobs: parseInt(savedCountResult.rows[0].count),
      recentApplications: recentApplicationsResult.rows,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getJobSeekerProfiles = async (req, res) => {
  const {
    professional_title,
    experience_level,
    skill,
    gender,
    languages,
    education_level,
    page = 1,
    limit = 10,
  } = req.query;

  try {
    const offset = (page - 1) * limit;
    const conditions = [
      "js.status = 'active'",
      "js.professional_title IS NOT NULL AND js.professional_title != ''",
      "js.experience_level IS NOT NULL AND js.experience_level != ''",
      "js.education_level IS NOT NULL AND js.education_level != ''",
      "js.gender IS NOT NULL AND js.gender != ''",
    ];
    const values = [];
    let index = 1;

    if (professional_title) {
      conditions.push(`js.professional_title ILIKE $${index++}`);
      values.push(`%${professional_title}%`);
    }
    if (experience_level) {
      conditions.push(`js.experience_level = $${index++}`);
      values.push(experience_level);
    }
    if (skill) {
      conditions.push(`js.skills::text ILIKE $${index++}`);
      values.push(`%${skill}%`);
    }
    if (gender) {
      conditions.push(`js.gender = $${index++}`);
      values.push(gender);
    }
    if (languages) {
      conditions.push(
        `js.id IN (SELECT job_seeker_id FROM languages WHERE language ILIKE $${index++})`,
      );
      values.push(`%${languages}%`);
    }
    if (education_level) {
      conditions.push(`js.education_level = $${index++}`);
      values.push(education_level);
    }

    const whereClause = conditions.join(" AND ");
    const limitIdx = index++;
    const offsetIdx = index++;
    values.push(Number(limit), offset);

    const result = await db.query(
      `SELECT js.*, COALESCE(u.email, js.user_email) AS email
       FROM job_seeker js
       LEFT JOIN users u ON js.user_id = u.id
       WHERE ${whereClause}
       ORDER BY js.created_at DESC
       LIMIT $${limitIdx} OFFSET $${offsetIdx}`,
      values,
    );
    return res.status(200).json(result.rows);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching job seeker profiles" });
  }
};
