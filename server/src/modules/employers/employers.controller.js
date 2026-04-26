import db from "../../config/db.js";

export const getEmployerProfile = async (req, res) => {
  const { id } = req.params;

  let user;

  try {
    if (req.user?.userId === id || req.user?.role === "admin") {
      user = await db.query(
        `SELECT users.id,
        users.is_email_verified,
        users.email,
        users.role,
        employers.* 
        FROM users 
        INNER JOIN employers 
        ON users.id = employers.user_id 
        WHERE users.id = $1 `,
        [id],
      );

      if (user.rows[0].status === "deactivated" || user.rows[0].status === "suspended") {
        return res
          .status(403)
          .json({ message: "Employer account is not active, contact support" });
      }
    } else {
      user = await db.query(
        `SELECT users.id,
        employers.id AS employer_id,
        employers.user_id, 
        employers.company_name,
        employers.size,
        employers.address,
        employers.logo,
        employers.cover_image,
        employers.description,
        employers.missions,
        employers.founding_year,
        employers.linkedin,
        employers.website,
        employers.industry 
        FROM users 
        INNER JOIN employers 
        ON users.id = employers.user_id 
        WHERE users.id = $1 AND employers.status IN ('active', 'unverified') AND users.is_email_verified = true`,
        [id],
      );
    }

    if (user.rows.length === 0) {
      return res.status(404).json({ message: "Employer not found" });
    }
    res.status(200).json(user.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateEmployerProfile = async (req, res) => {
  const { id } = req.params;
  const {
    company_name,
    size,
    address,
    phone_number,
    logo,
    cover_image,
    description,
    missions,
    founding_year,
    linkedin,
    website,
    industry,
  } = req.body;

  if (!company_name || !size || !address || !phone_number || !industry) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const employer = await db.query(
      "SELECT * FROM employers WHERE user_id = $1",
      [id],
    );

    if (
      employer.rows[0].status !== "active" &&
      employer.rows[0].status !== "unverified"
    ) {
      return res
        .status(403)
        .json({
          error_code: "EMPLOYER_INACTIVE",
          message: "Employer account is not active, contact support",
        });
    }

    const updates = [];
    const values = [];
    let index = 1;

    if (company_name !== "") {
      updates.push(`company_name = $${index++}`);
      values.push(company_name);
    }

    if (size !== "") {
      updates.push(`size = $${index++}`);
      values.push(size);
    }

    if (address !== "") {
      updates.push(`address = $${index++}`);
      values.push(address);
    }

    if (phone_number !== "") {
      updates.push(`phone_number = $${index++}`);
      values.push(phone_number);
    }

    if (logo !== "") {
      updates.push(`logo = $${index++}`);
      values.push(logo);
    }

    if (cover_image !== "") {
      updates.push(`cover_image = $${index++}`);
      values.push(cover_image);
    }

    if (description !== "") {
      updates.push(`description = $${index++}`);
      values.push(description);
    }

    if (missions.length > 0) {
      updates.push(`missions = $${index++}`);
      values.push(missions);
    }

    if (founding_year !== 0) {
      updates.push(`founding_year = $${index++}`);
      values.push(founding_year === "" ? 0 : parseInt(founding_year));
    }

    if (linkedin !== "") {
      updates.push(`linkedin = $${index++}`);
      values.push(linkedin);
    }

    if (website !== "") {
      updates.push(`website = $${index++}`);
      values.push(website);
    }

    if (industry !== "") {
      updates.push(`industry = $${index++}`);
      values.push(industry);
    }

    // prevent empty update
    if (updates.length === 0) {
      return res.status(400).json({ message: "No fields provided to update" });
    }

    // add employer id
    values.push(id);

    const query = `
  UPDATE employers
  SET ${updates.join(", ")}
  WHERE user_id = $${index}
  RETURNING *
`;

    const result = await db.query(query, values);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Employer not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getEmployersProfiles = async (req, res) => {};

export const getDashboardStats = async (req, res) => {
  const userId = req.user.userId;

  try {
    // Get the employer record
    const employer = await db.query(
      "SELECT id FROM employers WHERE user_id = $1",
      [userId],
    );

    if (!employer.rows.length) {
      return res.status(404).json({ message: "Employer not found" });
    }

    const employerId = employer.rows[0].id;

    // Run all queries in parallel
    const [
      totalJobsResult,
      activeJobsResult,
      totalApplicantsResult,
      recentJobsResult,
      recentApplicantsResult,
    ] = await Promise.all([
      // Total job posts
      db.query(
        "SELECT COUNT(*) AS count FROM job_post WHERE employer_id = $1 AND status != 'Deleted'",
        [employerId],
      ),
      // Active job posts
      db.query(
        "SELECT COUNT(*) AS count FROM job_post WHERE employer_id = $1 AND status = 'Active'",
        [employerId],
      ),
      // Total applicants across all jobs
      db.query(
        `SELECT COUNT(*) AS count FROM applications
         INNER JOIN job_post ON applications.job_post = job_post.id
         WHERE job_post.employer_id = $1`,
        [employerId],
      ),
      // Recent 5 job posts
      db.query(
        `SELECT id, title, status, location, job_type, created_at, applicants
         FROM job_post
         WHERE employer_id = $1 AND status != 'Deleted'
         ORDER BY created_at DESC LIMIT 5`,
        [employerId],
      ),
      // Recent 5 applicants
      db.query(
        `SELECT
           a.id AS application_id,
           a.created_at AS applied_at,
           jp.id AS job_post_id,
           jp.title AS job_title,
           js.first_name,
           js.last_name,
           js.professional_title,
           js.profile_image
         FROM applications a
         INNER JOIN job_post jp ON a.job_post = jp.id
         INNER JOIN job_seeker js ON a.jobseeker = js.id
         WHERE jp.employer_id = $1
         ORDER BY a.created_at DESC LIMIT 5`,
        [employerId],
      ),
    ]);

    return res.status(200).json({
      totalJobs: parseInt(totalJobsResult.rows[0].count),
      activeJobs: parseInt(activeJobsResult.rows[0].count),
      totalApplicants: parseInt(totalApplicantsResult.rows[0].count),
      recentJobs: recentJobsResult.rows,
      recentApplicants: recentApplicantsResult.rows,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
