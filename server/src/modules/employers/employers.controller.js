import db from "../../config/db.js";

export const getEmployerProfile = async (req, res) => {
  const { id } = req.params;

  let user;

  try {
    if ((req.user && req.user.id === id) || req.user.role === "admin") {
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

      if (
        user.rows[0].status === "desactivated" ||
        user.rows[0].status === "suspended"
      ) {
        return res
          .status(403)
          .json({ message: "Employer account is not active, contact support" });
      }
    } else {
      user = await db.query(
        `SELECT users.id,
        employers.id AS employer_id,
        employers.user_id, 
        employers.name,
        employers.size,
        employers.address,
        employers.logo,
        employers.cover_image,
        employers.description,
        employers.mission,
        employers.founding_year,
        employers.linkedin,
        employers.website,
        employers.industry 
        FROM users 
        INNER JOIN employers 
        ON users.id = employers.user_id 
        WHERE users.id = $1 AND employers.status = 'active' AND users.is_email_verified = true `,
        [id],
      );
    }

    if (user.rows.length === 0) {
      return res.status(404).json({ message: "Employer not found" });
    }
    res.status(200).json(user.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateEmployerProfile = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    size,
    address,
    phone_number,
    logo,
    cover_image,
    description,
    mission,
    founding_year,
    linkedin,
    website,
    industry,
  } = req.body;

  if (!name || !size || !address || !phone_number || !industry) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const updates = [];
    const values = [];
    let index = 1;

    if (name !== undefined) {
      updates.push(`name = $${index++}`);
      values.push(name);
    }

    if (size !== undefined) {
      updates.push(`size = $${index++}`);
      values.push(size);
    }

    if (address !== undefined) {
      updates.push(`address = $${index++}`);
      values.push(address);
    }

    if (phone_number !== undefined) {
      updates.push(`phone_number = $${index++}`);
      values.push(phone_number);
    }

    if (logo !== undefined) {
      updates.push(`logo = $${index++}`);
      values.push(logo);
    }

    if (cover_image !== undefined) {
      updates.push(`cover_image = $${index++}`);
      values.push(cover_image);
    }

    if (description !== undefined) {
      updates.push(`description = $${index++}`);
      values.push(description);
    }

    if (mission !== undefined) {
      updates.push(`mission = $${index++}`);
      values.push(mission);
    }

    if (founding_year !== undefined) {
      updates.push(`founding_year = $${index++}`);
      values.push(founding_year);
    }

    if (linkedin !== undefined) {
      updates.push(`linkedin = $${index++}`);
      values.push(linkedin);
    }

    if (website !== undefined) {
      updates.push(`website = $${index++}`);
      values.push(website);
    }

    if (industry !== undefined) {
      updates.push(`industry = $${index++}`);
      values.push(industry);
    }

    // prevent empty update
    if (updates.length === 0) {
      return res.status(400).json({ message: "No fields provided to update" });
    }

    // add employer id
    values.push(req.user.id);

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
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getEmployersProfiles = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  try {
  } catch (error) {}
};
