import db from "../../config/db.js";

export const createExperience = async (req, res) => {
  const {
    userId,
    title,
    company,
    from,
    to,
    is_current = false,
    description,
  } = req.body;

  if (!title || !company || !from) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    if (!is_current) {
      if (!to) {
        return res.status(400).json({ message: "Missing required fields" });
      } else if (new Date(from) > new Date(to)) {
        return res.status(400).json({ message: "Invalid date range" });
      } else {
        const newExperience = await db.query(
          'INSERT INTO experiences (user_id, title, company, "from", "to", is_current, description) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
          [userId, title, company, from, to, is_current, description],
        );
        return res.status(201).json(newExperience.rows[0]);
      }
    } else {
      const newExperience = await db.query(
        'INSERT INTO experiences (user_id, title, company, "from", is_current, description) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [userId, title, company, from, is_current, description],
      );
      return res.status(201).json(newExperience.rows[0]);
    }
  } catch (error) {
    console.error("Error creating experience:", error);
    return res.status(500).json({ message: "Error creating experience" });
  }
};

export const updateExperience = async (req, res) => {
  const { id } = req.params;
  const {
    title,
    company,
    from,
    to,
    is_current = false,

    description,
  } = req.body;

  if (!title || !company || !from) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    if (!is_current) {
      if (!to) {
        return res.status(400).json({ message: "Missing required fields" });
      } else if (new Date(from) > new Date(to)) {
        return res.status(400).json({ message: "Invalid date range" });
      } else {
        const newEducation = await db.query(
          'UPDATE experiences SET title=$2, company=$3, "from"=$4, "to"=$5, is_current=$6, description=$7 WHERE id=$1 RETURNING *',
          [id, title, company, from, to, is_current, description],
        );
        return res.status(201).json(newEducation.rows[0]);
      }
    } else {
      const newEducation = await db.query(
        'UPDATE experiences SET title=$2, company=$3, "from"=$4, is_current=$5, description=$6 WHERE id=$1 RETURNING *',
        [id, title, company, from, is_current, description],
      );
      return res.status(201).json(newEducation.rows[0]);
    }
  } catch (error) {
    console.error("Error creating experience:", error);
    return res.status(500).json({ message: "Error creating experience" });
  }
};

export const deleteExperience = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(
      "DELETE FROM experiences WHERE id=$1 RETURNING *",
      [id],
    );
    return res.status(200).json({ message: "Experience deleted successfully" });
  } catch (error) {
    console.error("Error deleting experience:", error);
    return res.status(500).json({ message: "Error deleting experience" });
  }
};
