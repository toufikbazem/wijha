import db from "../../config/db.js";

// Turn a hub name into a URL-safe base slug (mirrors the client-side slugify).
const slugify = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

// req.user.userId is the users table id, not the employers id — resolve it.
// Returns the employers.id or null when this user has no employer profile.
const getEmployerId = async (userId) => {
  const result = await db.query("SELECT id FROM employers WHERE user_id = $1", [
    userId,
  ]);
  return result.rows[0]?.id ?? null;
};

export const createHub = async (req, res) => {
  const { name, description = "", status = "active" } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ message: "Hub name is required" });
  }

  if (!["active", "closed", "draft"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  try {
    // req.user.userId is the users table id, not the employers id — resolve it.
    const employer = await db.query(
      "SELECT id FROM employers WHERE user_id = $1",
      [req.user.userId],
    );

    if (employer.rows.length === 0) {
      return res.status(404).json({ message: "Employer profile not found" });
    }

    const employerId = employer.rows[0].id;

    // The slug is part of the public share URL and must be unique (DB enforces
    // it too). A short random suffix keeps it unguessable and collision-free.
    const base = slugify(name) || "hub";
    const slug = `${base}-${Math.random().toString(36).slice(2, 7)}`;

    const result = await db.query(
      `INSERT INTO cv_hub (employer_id, name, description, status, slug)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [employerId, name.trim(), description.trim(), status, slug],
    );

    return res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating CV hub:", error);
    return res.status(500).json({ message: "Error creating hub" });
  }
};

export const getHub = async (req, res) => {
  const { id } = req.params;

  try {
    // req.user.userId is the users table id, not the employers id — resolve it.
    const employer = await db.query(
      "SELECT id FROM employers WHERE user_id = $1",
      [req.user.userId],
    );

    if (employer.rows.length === 0) {
      return res.status(404).json({ message: "Employer profile not found" });
    }

    const employerId = employer.rows[0].id;

    // Scope to the owning employer (admins may read any hub) and attach the
    // submission counts the hub view needs.
    const result = await db.query(
      `SELECT h.*,
         COALESCE(s.cv_count, 0)  AS cv_count,
         COALESCE(s.new_count, 0) AS new_count
       FROM cv_hub h
       LEFT JOIN (
         SELECT hub_id,
                COUNT(*)                       AS cv_count,
                COUNT(*) FILTER (WHERE is_new) AS new_count
         FROM cv_hub_submission
         GROUP BY hub_id
       ) s ON s.hub_id = h.id
       WHERE h.id = $1
         AND ($2 = true OR h.employer_id = $3)`,
      [id, req.user.role === "admin", employerId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Hub not found" });
    }

    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching CV hub:", error);
    return res.status(500).json({ message: "Error fetching hub" });
  }
};

export const getHubs = async (req, res) => {
  const { search = "", status = "all", page = 1, limit = 10 } = req.query;
  const offset = (Number(page) - 1) * Number(limit);

  try {
    // req.user.userId is the users table id, not the employers id — resolve it.
    const employer = await db.query(
      "SELECT id FROM employers WHERE user_id = $1",
      [req.user.userId],
    );

    if (employer.rows.length === 0) {
      return res.status(404).json({ message: "Employer profile not found" });
    }

    const employerId = employer.rows[0].id;

    // Build the WHERE clause incrementally so optional filters are parameterized.
    const conditions = ["employer_id = $1"];
    const values = [employerId];
    let index = 2;

    if (search.trim() !== "") {
      conditions.push(`name ILIKE $${index++}`);
      values.push(`%${search.trim()}%`);
    }

    if (status !== "all") {
      if (!["active", "closed", "draft"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      conditions.push(`status = $${index++}`);
      values.push(status);
    }

    const where = conditions.join(" AND ");

    const result = await db.query(
      `SELECT *, COUNT(*) OVER() AS total
       FROM cv_hub
       WHERE ${where}
       ORDER BY created_at DESC
       LIMIT $${index++} OFFSET $${index++}`,
      [...values, Number(limit), offset],
    );

    const total = result.rows.length ? Number(result.rows[0].total) : 0;

    return res.status(200).json({
      total,
      page: Number(page),
      limit: Number(limit),
      hubs: result.rows,
    });
  } catch (error) {
    console.error("Error fetching CV hubs:", error);
    return res.status(500).json({ message: "Error fetching hubs" });
  }
};

export const updateHub = async (req, res) => {
  const { id } = req.params;
  const { name, description, status } = req.body;

  if (status !== undefined && !["active", "closed", "draft"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  try {
    const employerId = await getEmployerId(req.user.userId);
    if (!employerId) {
      return res.status(404).json({ message: "Employer profile not found" });
    }

    // Ownership check (admins may edit any hub).
    const hub = await db.query(
      `SELECT id FROM cv_hub WHERE id = $1 AND ($2 = true OR employer_id = $3)`,
      [id, req.user.role === "admin", employerId],
    );
    if (hub.rows.length === 0) {
      return res.status(404).json({ message: "Hub not found" });
    }

    // Only update the fields that were provided.
    const updates = [];
    const values = [];
    let index = 1;

    if (name !== undefined) {
      if (!name.trim()) {
        return res.status(400).json({ message: "Hub name cannot be empty" });
      }
      updates.push(`name = $${index++}`);
      values.push(name.trim());
    }

    if (description !== undefined) {
      updates.push(`description = $${index++}`);
      values.push(description.trim());
    }

    if (status !== undefined) {
      updates.push(`status = $${index++}`);
      values.push(status);
    }

    if (updates.length === 0) {
      return res.status(400).json({ message: "No fields provided to update" });
    }

    const result = await db.query(
      `UPDATE cv_hub SET ${updates.join(", ")} WHERE id = $${index} RETURNING *`,
      [...values, id],
    );

    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error updating CV hub:", error);
    return res.status(500).json({ message: "Error updating hub" });
  }
};

export const deleteHub = async (req, res) => {
  const { id } = req.params;

  try {
    const employerId = await getEmployerId(req.user.userId);
    if (!employerId) {
      return res.status(404).json({ message: "Employer profile not found" });
    }

    // Delete only if owned (admins may delete any hub). Submissions cascade.
    const result = await db.query(
      `DELETE FROM cv_hub
       WHERE id = $1 AND ($2 = true OR employer_id = $3)
       RETURNING id`,
      [id, req.user.role === "admin", employerId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Hub not found" });
    }

    return res.status(200).json({ message: "Hub deleted successfully" });
  } catch (error) {
    console.error("Error deleting CV hub:", error);
    return res.status(500).json({ message: "Error deleting hub" });
  }
};

export const getSubmissions = async (req, res) => {
  const { id } = req.params;
  const { search = "", filter = "all", page = 1, limit = 10 } = req.query;
  const offset = (Number(page) - 1) * Number(limit);

  try {
    const employerId = await getEmployerId(req.user.userId);
    if (!employerId) {
      return res.status(404).json({ message: "Employer profile not found" });
    }

    // Ownership check on the hub before exposing its submissions.
    const hub = await db.query(
      `SELECT id FROM cv_hub WHERE id = $1 AND ($2 = true OR employer_id = $3)`,
      [id, req.user.role === "admin", employerId],
    );
    if (hub.rows.length === 0) {
      return res.status(404).json({ message: "Hub not found" });
    }

    // Build the WHERE clause incrementally so optional filters stay parameterized.
    const conditions = ["hub_id = $1"];
    const values = [id];
    let index = 2;

    if (filter === "new") {
      conditions.push("is_new = true");
    } else if (filter === "starred") {
      conditions.push("starred = true");
    } else if (filter !== "all") {
      return res.status(400).json({ message: "Invalid filter" });
    }

    if (search.trim() !== "") {
      conditions.push(
        `(first_name ILIKE $${index} OR last_name ILIKE $${index} OR title ILIKE $${index})`,
      );
      values.push(`%${search.trim()}%`);
      index++;
    }

    const where = conditions.join(" AND ");

    const result = await db.query(
      `SELECT *, COUNT(*) OVER() AS total
       FROM cv_hub_submission
       WHERE ${where}
       ORDER BY created_at DESC
       LIMIT $${index++} OFFSET $${index++}`,
      [...values, Number(limit), offset],
    );

    const total = result.rows.length ? Number(result.rows[0].total) : 0;

    return res.status(200).json({
      total,
      page: Number(page),
      limit: Number(limit),
      submissions: result.rows,
    });
  } catch (error) {
    console.error("Error fetching submissions:", error);
    return res.status(500).json({ message: "Error fetching submissions" });
  }
};

export const deleteSubmission = async (req, res) => {
  const { submissionId } = req.params;

  try {
    const employerId = await getEmployerId(req.user.userId);
    if (!employerId) {
      return res.status(404).json({ message: "Employer profile not found" });
    }

    // Delete only if the submission's hub belongs to this employer (admins any).
    const result = await db.query(
      `DELETE FROM cv_hub_submission s
       USING cv_hub h
       WHERE s.id = $1
         AND s.hub_id = h.id
         AND ($2 = true OR h.employer_id = $3)
       RETURNING s.id`,
      [submissionId, req.user.role === "admin", employerId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Submission not found" });
    }

    return res.status(200).json({ message: "Submission deleted successfully" });
  } catch (error) {
    console.error("Error deleting submission:", error);
    return res.status(500).json({ message: "Error deleting submission" });
  }
};

/* -------------------------------------------------------------------------- */
/* Public endpoints — reached by candidates via the QR code / share link.     */
/* No authentication: the candidate is not logged in.                         */
/* -------------------------------------------------------------------------- */

export const getPublicHub = async (req, res) => {
  const { slug } = req.params;

  try {
    const result = await db.query(
      "SELECT id, name, description, status FROM cv_hub WHERE slug = $1",
      [slug],
    );
    const hub = result.rows[0];

    // Only active hubs accept candidates; never leak draft/closed details.
    if (!hub || hub.status !== "active") {
      return res.status(404).json({ message: "This hub is not available" });
    }

    // Count the form view.
    await db.query("UPDATE cv_hub SET views = views + 1 WHERE id = $1", [
      hub.id,
    ]);

    return res.status(200).json({
      id: hub.id,
      name: hub.name,
      description: hub.description,
    });
  } catch (error) {
    console.error("Error fetching public hub:", error);
    return res.status(500).json({ message: "Error fetching hub" });
  }
};

export const submitToHub = async (req, res) => {
  const { slug } = req.params;
  const {
    firstName,
    lastName,
    title,
    email,
    phone,
    location,
    experienceLevel,
    educationLevel,
    skills = [],
    cvUrl,
  } = req.body;

  if (!firstName?.trim() || !lastName?.trim() || !email?.trim() || !cvUrl) {
    return res
      .status(400)
      .json({ message: "First name, last name, email and CV are required" });
  }

  try {
    const hubResult = await db.query(
      "SELECT id, status FROM cv_hub WHERE slug = $1",
      [slug],
    );
    const hub = hubResult.rows[0];

    if (!hub || hub.status !== "active") {
      return res
        .status(404)
        .json({ message: "This hub is not accepting submissions" });
    }

    await db.query(
      `INSERT INTO cv_hub_submission
         (hub_id, first_name, last_name, title, email, phone_number, address,
          experience_level, education_level, skills, cv_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      [
        hub.id,
        firstName.trim(),
        lastName.trim(),
        title?.trim() || null,
        email.trim(),
        phone?.trim() || null,
        location?.trim() || null,
        experienceLevel || null,
        educationLevel || null,
        Array.isArray(skills) ? skills : [],
        cvUrl,
      ],
    );

    return res.status(201).json({ message: "CV submitted successfully" });
  } catch (error) {
    console.error("Error submitting to hub:", error);
    return res.status(500).json({ message: "Error submitting CV" });
  }
};
