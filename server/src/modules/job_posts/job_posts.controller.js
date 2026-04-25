import db from "../../config/db.js";

export const createJobPost = async (req, res) => {
  const {
    employerId,
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
    is_anonymous,
  } = req.body;

  console.log(req.user.userId, employerId);

  // if (req.user.userId !== employerId && req.user.role !== "admin") {
  //   return res.status(403).json({ message: "Forbidden" });
  // }

  try {
    if (req.user.role === "employer") {
      const employer = await db.query(
        `
            SELECT users.id AS user_id, users.is_email_verified, employers.id AS employer_id, employers.status, employers.company_name
            FROM users
            INNER JOIN employers ON users.id = employers.user_id
            WHERE users.id = $1
            `,
        [req.user.userId],
      );

      if (!employer.rows.length) {
        return res.status(404).json({ message: "Employer profile not found" });
      }

      const employerData = employer.rows[0];

      if (!employerData.is_email_verified) {
        return res.status(403).json({ message: "Email not verified" });
      }

      if (employerData.status !== "active") {
        return res.status(403).json({ message: "Employer profile not active" });
      }
    }

    // Validate deadline is not more than 3 months in the future
    if (deadline) {
      const maxDate = new Date();
      maxDate.setMonth(maxDate.getMonth() + 3);
      if (new Date(deadline) > maxDate) {
        return res.status(400).json({ message: "Deadline cannot be more than 3 months from now" });
      }
    }

    const updates = [];
    const values = [];
    let index = 1;

    if (title !== undefined) {
      updates.push(`title`);
      values.push(title);
    }

    if (description !== undefined) {
      updates.push(`description`);
      values.push(description);
    }

    if (location !== undefined) {
      updates.push(`location`);
      values.push(location);
    }

    if (industry !== undefined) {
      updates.push(`industry`);
      values.push(industry);
    }

    if (job_type !== undefined) {
      updates.push(`job_type`);
      values.push(job_type);
    }

    if (job_mode !== undefined) {
      updates.push(`job_mode`);
      values.push(job_mode);
    }

    if (experience_level !== undefined) {
      updates.push(`experience_level`);
      values.push(experience_level);
    }

    if (education_level !== undefined) {
      updates.push(`education_level`);
      values.push(education_level);
    }

    if (min_salary !== "") {
      updates.push(`min_salary`);
      values.push(min_salary);
    }

    if (max_salary !== "") {
      updates.push(`max_salary`);
      values.push(max_salary);
    }

    if (deadline !== undefined) {
      updates.push(`deadline`);
      values.push(deadline);
    }

    if (number_of_positions !== undefined) {
      updates.push(`number_of_positions`);
      values.push(number_of_positions);
    }

    if (is_anonymous !== undefined) {
      updates.push(`is_anonymous`);
      values.push(is_anonymous);
    }

    if (employerId !== undefined) {
      updates.push(`employer_id`);
      values.push(employerId);
    }

    updates.push(`created_by`);
    values.push(req.user.userId);

    const status = req.user.role === "admin" ? "Active" : "In-review";
    updates.push(`status`);
    values.push(status);

    // Link to subscription if present
    if (req.subscription?.id) {
      updates.push(`subscription_id`);
      values.push(req.subscription.id);
    }

    // prevent empty update
    if (updates.length === 0) {
      return res.status(400).json({ message: "No fields provided to update" });
    }

    const query = `INSERT INTO job_post (${updates.join(", ")}) VALUES (${values
      .map((_, i) => `$${i + 1}`)
      .join(", ")}) RETURNING *`;

    const result = await db.query(query, values);

    // Increment subscription usage
    if (req.subscription?.id) {
      await db.query(
        `UPDATE subscription_usage
         SET job_post_used = job_post_used + 1
         WHERE subscription_id = $1`,
        [req.subscription.id],
      );
    }

    return res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating job post:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateJobPost = async (req, res) => {
  const { id } = req.params;
  const {
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
    is_anonymous,
  } = req.body;

  try {
    if (req.user.role === "employer") {
      const employer = await db.query(
        `
            SELECT users.id AS user_id, users.is_email_verified, employers.id AS employer_id, employers.status, employers.company_name
            FROM users
            INNER JOIN employers ON users.id = employers.user_id
            WHERE users.id = $1
            `,
        [req.user.userId],
      );

      if (!employer.rows.length) {
        return res.status(404).json({ message: "Employer profile not found" });
      }

      const employerData = employer.rows[0];

      if (!employerData.is_email_verified) {
        return res.status(403).json({ message: "Email not verified" });
      }

      if (employerData.status !== "active") {
        return res.status(403).json({ message: "Employer profile not active" });
      }
    }

    // Validate deadline is not more than 3 months in the future
    if (deadline) {
      const maxDate = new Date();
      maxDate.setMonth(maxDate.getMonth() + 3);
      if (new Date(deadline) > maxDate) {
        return res.status(400).json({ message: "Deadline cannot be more than 3 months from now" });
      }
    }

    const updates = [];
    const values = [];
    let index = 1;

    if (title !== undefined) {
      updates.push(`title`);
      values.push(title);
    }

    if (description !== undefined) {
      updates.push(`description`);
      values.push(description);
    }

    if (location !== undefined) {
      updates.push(`location`);
      values.push(location);
    }

    if (industry !== undefined) {
      updates.push(`industry`);
      values.push(industry);
    }

    if (job_type !== undefined) {
      updates.push(`job_type`);
      values.push(job_type);
    }

    if (job_mode !== undefined) {
      updates.push(`job_mode`);
      values.push(job_mode);
    }

    if (experience_level !== undefined) {
      updates.push(`experience_level`);
      values.push(experience_level);
    }

    if (education_level !== undefined) {
      updates.push(`education_level`);
      values.push(education_level);
    }

    if (min_salary !== "") {
      updates.push(`min_salary`);
      values.push(min_salary);
    }

    if (max_salary !== "") {
      updates.push(`max_salary`);
      values.push(max_salary);
    }

    if (deadline !== undefined) {
      updates.push(`deadline`);
      values.push(deadline);
    }

    if (number_of_positions !== undefined) {
      updates.push(`number_of_positions`);
      values.push(number_of_positions);
    }

    if (is_anonymous !== undefined) {
      updates.push(`is_anonymous`);
      values.push(is_anonymous);
    }

    const status = req.user.role === "admin" ? "Active" : "In-review";
    updates.push(`status`);
    values.push(status);

    // prevent empty update
    if (updates.length === 0) {
      return res.status(400).json({ message: "No fields provided to update" });
    }

    const query = `UPDATE job_post SET ${updates
      .map((update, i) => `${update} = $${i + 1}`)
      .join(", ")} WHERE id = $${updates.length + 1} RETURNING *`;

    const result = await db.query(query, [...values, id]);

    return res.status(201).json(result.rows[0]);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateJobPostStatus = async (req, res) => {
  const { id } = req.params;
  const { status: newStatus, status_reason } = req.body;

  if (!newStatus) {
    return res.status(400).json({ message: "Status is required" });
  }

  // Define allowed transitions per role
  const employerTransitions = {
    Draft: ["In-review"],
    Active: ["Paused"],
    Paused: ["In-review"],
  };

  const adminTransitions = {
    "In-review": ["Active", "Rejected", "Pending"],
    Pending: ["Active", "Rejected", "In-review"],
    Active: ["Paused", "Pending"],
    Paused: ["Active", "In-review", "Pending"],
    Rejected: ["In-review", "Pending"],
  };

  try {
    // Fetch the job post
    const jobResult = await db.query(
      `SELECT job_post.*, employers.user_id AS owner_id
       FROM job_post
       INNER JOIN employers ON job_post.employer_id = employers.id
       WHERE job_post.id = $1`,
      [id],
    );

    if (!jobResult.rows.length) {
      return res.status(404).json({ message: "Job post not found" });
    }

    const job = jobResult.rows[0];

    // Employer: verify ownership
    if (req.user.role === "employer" && job.owner_id !== req.user.userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const currentStatus = job.status;

    // Handle soft delete — employer can delete from any non-deleted status
    if (newStatus === "Deleted") {
      if (req.user.role !== "employer" && req.user.role !== "admin") {
        return res.status(403).json({ message: "Forbidden" });
      }
      if (currentStatus === "Deleted") {
        return res.status(400).json({ message: "Job post is already deleted" });
      }
    } else {
      // Validate transition based on role
      let allowedStatuses;
      if (req.user.role === "admin") {
        allowedStatuses = adminTransitions[currentStatus];
      } else if (req.user.role === "employer") {
        allowedStatuses = employerTransitions[currentStatus];
      } else {
        return res.status(403).json({ message: "Forbidden" });
      }

      if (!allowedStatuses || !allowedStatuses.includes(newStatus)) {
        return res.status(400).json({
          message: `Cannot change status from "${currentStatus}" to "${newStatus}"`,
        });
      }
    }

    const reasonValue = (newStatus === "Rejected" || newStatus === "Suspended") ? (status_reason || null) : null;

    const result = await db.query(
      `UPDATE job_post SET status = $1, status_reason = $2 WHERE id = $3 RETURNING *`,
      [newStatus, reasonValue, id],
    );

    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error updating job post status:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getJobPost = async (req, res) => {
  const { id } = req.params;
  let result;
  try {
    // Auto-expire active jobs past their deadline
    await db.query(
      `UPDATE job_post SET status = 'Expired' WHERE status = 'Active' AND deadline < NOW()`,
    );

    if (req.user?.role === "employer" || req.user?.role === "admin") {
      result = await db.query(
        `
              SELECT job_post.*, employers.company_name, employers.logo, employers.user_id AS employerId, employers.description AS employer_description, employers.industry AS employer_industry, employers.website AS employer_website, employers.size AS employer_size, employers.founding_year AS employer_founded_year
              FROM job_post
              INNER JOIN employers
              ON job_post.employer_id = employers.id
              WHERE job_post.id = $1
              `,
        [id],
      );
    } else {
      result = await db.query(
        `
              SELECT job_post.*, employers.company_name, employers.logo, employers.user_id AS employerId, employers.description AS employer_description, employers.industry AS employer_industry, employers.website AS employer_website, employers.size AS employer_size, employers.founding_year AS employer_founded_year
              FROM job_post
              INNER JOIN employers
              ON job_post.employer_id = employers.id
              WHERE job_post.id = $1 AND job_post.status = 'Active'
            `,
        [id],
      );
    }
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Job post not found" });
    }

    const job = result.rows[0];

    // Hide company info for anonymous job posts (unless viewed by the owning employer or admin)
    if (job.is_anonymous) {
      const isOwnerOrAdmin =
        req.user?.role === "admin" ||
        (req.user?.role === "employer" && req.user?.userId === job.employerid);

      if (!isOwnerOrAdmin) {
        job.company_name = null;
        job.logo = null;
        job.employer_description = null;
        job.employer_industry = null;
        job.employer_website = null;
        job.employer_size = null;
        job.employer_founded_year = null;
        job.employerid = null;
      }
    }

    return res.status(200).json(job);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getJobPosts = async (req, res) => {
  const {
    search,
    location,
    job_type,
    job_mode,
    experience_level,
    education_level,
    employerId,
    industry,
    status = null,
    sortBy = "newest",
    limit = 10,
    page = 1,
  } = req.query;

  console.log(req.query);

  const offset = (page - 1) * limit;

  try {
    // Auto-expire active jobs past their deadline
    await db.query(
      `UPDATE job_post SET status = 'Expired' WHERE status = 'Active' AND deadline < NOW()`,
    );

    const query = `
      SELECT 
    jp.*,
    e.company_name,
    e.logo,
    e.user_id AS employer_id,
    COUNT(*) OVER() AS total
FROM job_post jp
JOIN employers e ON jp.employer_id = e.id
WHERE
    -- Search
    (
        $1::text IS NULL OR
        jp.title ILIKE '%' || $1 || '%' OR
        jp.description ILIKE '%' || $1 || '%' OR
        e.company_name ILIKE '%' || $1 || '%'
    )

    -- Location
    AND ($2::text IS NULL OR jp.location ILIKE '%' || $2 || '%')

    -- Job type
    AND ($3::text IS NULL OR jp.job_type = $3)

    -- Job mode
    AND ($4::text IS NULL OR jp.job_mode = $4)

    -- Experience level
    AND ($5::text IS NULL OR jp.experience_level = $5)

    -- Education level
    AND ($6::text IS NULL OR jp.education_level = $6)

    -- Employer
    AND ($7::uuid IS NULL OR jp.employer_id = $7)

    -- Industry
    AND ($8::text IS NULL OR jp.industry = $8)

    -- Status (exclude Deleted by default)
    AND ($9::job_status IS NULL OR jp.status = $9)
    AND ($9::job_status IS NOT NULL OR jp.status != 'Deleted')

ORDER BY

    -- Search priority
    CASE
        WHEN $1 IS NULL THEN 4
        WHEN jp.title ILIKE '%' || $1 || '%' THEN 1
        WHEN jp.description ILIKE '%' || $1 || '%' THEN 2
        WHEN e.company_name ILIKE '%' || $1 || '%' THEN 3
        ELSE 4
    END,

    -- Sort
    CASE WHEN $10 = 'latest' THEN jp.created_at END DESC,
    CASE WHEN $10 = 'oldest' THEN jp.created_at END ASC

LIMIT $11
OFFSET $12;
    `;

    const values = [
      search,
      location,
      job_type,
      job_mode,
      experience_level,
      education_level,
      employerId,
      industry,
      status,
      sortBy,
      limit,
      offset,
    ];

    const result = await db.query(query, values);

    const total = result.rows.length ? result.rows[0].total : 0;

    // Hide company info for anonymous job posts in list
    const jobs = result.rows.map((job) => {
      if (job.is_anonymous) {
        return {
          ...job,
          company_name: null,
          logo: null,
          employer_id: null,
        };
      }
      return job;
    });

    res.json({
      total,
      page,
      limit,
      jobs,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "internal server error" });
  }
};
