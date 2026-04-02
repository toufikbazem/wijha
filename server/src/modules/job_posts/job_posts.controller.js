import db from "../../config/db.js";

export const createJobPost = async (req, res) => {
  const {
    employerId,
    companyName,
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

  try {
    if (req.user.role === "employer") {
      const employer = await db.query(
        `
            SELECT users.id AS user_id, users.is_email_verified, employers.id AS employer_id, employers.status, employers.name
            FROM users
            INNER JOIN employers ON users.id = employers.user_id
            WHERE users.id = $1
            `,
        [req.user.id],
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
    // check required fields

    // check deadline data is valid not more than 3 months in the future

    const updates = [];
    const values = [];
    let index = 1;

    if (companyName !== undefined) {
      updates.push(`company_name = $${index++}`);
      values.push(companyName);
    }

    if (title !== undefined) {
      updates.push(`title = $${index++}`);
      values.push(title);
    }

    if (description !== undefined) {
      updates.push(`description = $${index++}`);
      values.push(description);
    }

    if (location !== undefined) {
      updates.push(`location = $${index++}`);
      values.push(location);
    }

    if (industry !== undefined) {
      updates.push(`industry = $${index++}`);
      values.push(industry);
    }

    if (job_type !== undefined) {
      updates.push(`job_type = $${index++}`);
      values.push(job_type);
    }

    if (job_mode !== undefined) {
      updates.push(`job_mode = $${index++}`);
      values.push(job_mode);
    }

    if (experience_level !== undefined) {
      updates.push(`experience_level = $${index++}`);
      values.push(experience_level);
    }

    if (education_level !== undefined) {
      updates.push(`education_level = $${index++}`);
      values.push(education_level);
    }

    if (min_salary !== undefined) {
      updates.push(`min_salary = $${index++}`);
      values.push(min_salary);
    }

    if (max_salary !== undefined) {
      updates.push(`max_salary = $${index++}`);
      values.push(max_salary);
    }

    if (deadline !== undefined) {
      updates.push(`deadline = $${index++}`);
      values.push(deadline);
    }

    if (number_of_positions !== undefined) {
      updates.push(`number_of_positions = $${index++}`);
      values.push(number_of_positions);
    }

    if (employerId !== undefined) {
      updates.push(`employer_id = $${index++}`);
      values.push(employerId);
    }

    updates.push(`created_by = $${index++}`);
    values.push(req.user.id);

    const status = req.user.role === "admin" ? "active" : "pending";
    updates.push(`status = $${index++}`);
    values.push(status);

    // prevent empty update
    if (updates.length === 0) {
      return res.status(400).json({ message: "No fields provided to update" });
    }

    const query = `INSERT INTO job_posts (${updates.join(", ")}) VALUES (${values
      .map((_, i) => `$${i + 1}`)
      .join(", ")}) RETURNING *`;

    const result = await db.query(query, values);

    return res.status(201).json(result.rows[0]);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateJobPost = async (req, res) => {
  const { id } = req.params;
  const {
    employerId,
    companyName,
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

  try {
    if (req.user.role === "employer") {
      const employer = await db.query(
        `
            SELECT users.id AS user_id, users.is_email_verified, employers.id AS employer_id, employers.status, employers.name
            FROM users
            INNER JOIN employers ON users.id = employers.user_id
            WHERE users.id = $1
            `,
        [req.user.id],
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
    // check required fields

    // check deadline data is valid not more than 3 months in the future

    const updates = [];
    const values = [];
    let index = 1;

    if (companyName !== undefined) {
      updates.push(`company_name = $${index++}`);
      values.push(companyName);
    }

    if (title !== undefined) {
      updates.push(`title = $${index++}`);
      values.push(title);
    }

    if (description !== undefined) {
      updates.push(`description = $${index++}`);
      values.push(description);
    }

    if (location !== undefined) {
      updates.push(`location = $${index++}`);
      values.push(location);
    }

    if (industry !== undefined) {
      updates.push(`industry = $${index++}`);
      values.push(industry);
    }

    if (job_type !== undefined) {
      updates.push(`job_type = $${index++}`);
      values.push(job_type);
    }

    if (job_mode !== undefined) {
      updates.push(`job_mode = $${index++}`);
      values.push(job_mode);
    }

    if (experience_level !== undefined) {
      updates.push(`experience_level = $${index++}`);
      values.push(experience_level);
    }

    if (education_level !== undefined) {
      updates.push(`education_level = $${index++}`);
      values.push(education_level);
    }

    if (min_salary !== undefined) {
      updates.push(`min_salary = $${index++}`);
      values.push(min_salary);
    }

    if (max_salary !== undefined) {
      updates.push(`max_salary = $${index++}`);
      values.push(max_salary);
    }

    if (deadline !== undefined) {
      updates.push(`deadline = $${index++}`);
      values.push(deadline);
    }

    if (number_of_positions !== undefined) {
      updates.push(`number_of_positions = $${index++}`);
      values.push(number_of_positions);
    }

    const status = req.user.role === "admin" ? "active" : "pending";
    updates.push(`status = $${index}`);
    values.push(status);

    // prevent empty update
    if (updates.length === 0) {
      return res.status(400).json({ message: "No fields provided to update" });
    }

    const query = `UPDATE job_posts SET ${updates
      .map((update, i) => `${update} = $${i + 1}`)
      .join(", ")} WHERE id = $${index} RETURNING *`;

    const result = await db.query(query, [...values, id]);

    return res.status(201).json(result.rows[0]);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getJobPost = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(
      `
            SELECT *
            FROM job_posts 
            WHERE job_posts.id = $1 AND job_posts.status = 'active'
            `,
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Job post not found" });
    }

    return res.status(200).json(result.rows[0]);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getJobPosts = async (req, res) => {};
