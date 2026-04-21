import db from "../../config/db.js";

export const createLanguage = async (req, res) => {
  const { userId, language, level } = req.body;

  if (!language || !level) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const newLanguage = await db.query(
      "INSERT INTO languages (user_id, language, level) VALUES ($1, $2, $3) RETURNING *",
      [userId, language, level],
    );
    return res.status(201).json(newLanguage.rows[0]);
  } catch (error) {
    return res.status(500).json({ message: "Error creating language" });
  }
};

export const updateLanguage = async (req, res) => {
  const { id, language, level } = req.body;

  if (!language || !level) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const updatedLanguage = await db.query(
      "UPDATE languages SET language = $2, level = $3 WHERE id = $1 RETURNING *",
      [id, language, level],
    );
    return res.status(201).json(updatedLanguage.rows[0]);
  } catch (error) {
    return res.status(500).json({ message: "Error updating language" });
  }
};

export const deleteLanguage = async (req, res) => {
  const { id } = req.params;

  try {
    const newLanguage = await db.query(
      "DELETE FROM languages WHERE id = $1 RETURNING *",
      [id],
    );
    return res.status(201).json(newLanguage.rows[0]);
  } catch (error) {
    return res.status(500).json({ message: "Error deleting language" });
  }
};
