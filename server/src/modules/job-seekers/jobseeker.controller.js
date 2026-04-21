import db from "../../config/db.js";

export const getJobSeekerProfile = async (req, res) => {
  const { id } = req.params;
  console.log(id);

  if (!id) {
    return res.status(400).json({ message: "Job seeker ID is required" });
  }

  // If the requester is an employer, verify they have active profile_access
  if (req.user.role === "employer") {
    try {
      const employerResult = await db.query(
        "SELECT id FROM employers WHERE user_id = $1",
        [req.user.userId],
      );

      if (employerResult.rows.length === 0) {
        return res.status(403).json({ message: "Employer not found" });
      }

      // Look up the job_seeker.id from users.id since profile_access stores job_seeker.id
      const jobSeekerResult = await db.query(
        "SELECT id FROM job_seeker WHERE user_id = $1",
        [id],
      );

      if (jobSeekerResult.rows.length === 0) {
        return res.status(404).json({ message: "Job seeker not found" });
      }

      const accessResult = await db.query(
        `SELECT id FROM profile_access
         WHERE employer = $1 AND job_seeker = $2 AND expire_at > NOW()`,
        [employerResult.rows[0].id, jobSeekerResult.rows[0].id],
      );

      if (accessResult.rows.length === 0) {
        return res
          .status(403)
          .json({ message: "You do not have access to this profile" });
      }
    } catch (error) {
      console.error("Error checking profile access:", error);
      return res.status(500).json({ message: "Error checking profile access" });
    }
  }

  try {
    const user = await db.query(
      "SELECT users.*, job_seeker.* FROM users INNER JOIN job_seeker ON users.id = job_seeker.user_id WHERE users.id = $1",
      [id],
    );

    const experience = await db.query(
      "SELECT * FROM experiences WHERE user_id = $1",
      [user.rows[0].id],
    );

    const education = await db.query(
      "SELECT * FROM educations WHERE user_id = $1",
      [user.rows[0].id],
    );

    const languages = await db.query(
      "SELECT * FROM languages WHERE user_id = $1",
      [user.rows[0].id],
    );

    if (user.rows.length === 0) {
      return res.status(404).json({ message: "Job seeker not found" });
    }

    const jobSeekerProfile = user.rows[0];
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
    experience_years,
    CV,
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
  if (experience_years) {
    updates.push(`experience_years = $${index++}`);
    values.push(experience_years);
  }
  if (CV) {
    updates.push(`cv = $${index++}`);
    values.push(CV);
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

  try {
    const query = `UPDATE job_seeker SET ${updates.join(", ")} WHERE id = $${index} AND status = 'active' RETURNING *`;
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
    experience_years,
    skill,
    gender,
    languages,
    study_degree,
    page = 1,
    limit = 10,
  } = req.query;

  try {
    const offset = (page - 1) * limit;
    const result = await db.query(
      `SELECT users.*, jobseeker.* 
      FROM users 
      INNER JOIN jobseeker 
      ON users.id = jobseeker.user_id 
      WHERE jobseeker.status = 'active' 
      AND jobseeker.professional_title ILIKE $3 AND jobseeker.experience_years >= $4 AND jobseeker.skills ILIKE $5 AND jobseeker.gender = $6 AND jobseeker.languages ILIKE $7 AND jobseeker.study_degree ILIKE $8 ORDER BY users.created_at DESC LIMIT $1 OFFSET $2`,
      [
        limit,
        offset,
        `%${professional_title}%`,
        experience_years,
        `%${skill}%`,
        gender,
        `%${languages}%`,
        `%${study_degree}%`,
      ],
    );
    return res.status(200).json(result.rows);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching job seeker profiles" });
  }
};
