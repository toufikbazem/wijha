import db from "../../config/db.js";

export const createEducation = async (req, res) => {
  const {
    userId,
    degree,
    institution,
    from,
    to,
    is_current,
    field_of_study,
    description,
  } = req.body;

  if (!degree || !institution || !from || !field_of_study || !is_current) {
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
          "INSERT INTO educations (user_id, degree, institution, from, to, is_current, field_of_study, description) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
          [
            userId,
            degree,
            institution,
            from,
            to,
            is_current,
            field_of_study,
            description,
          ],
        );
        return res.status(201).json(newEducation.rows[0]);
      }
    } else {
      const newEducation = await db.query(
        "INSERT INTO educations (user_id, degree, institution, from, is_current, field_of_study, description) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
        [
          userId,
          degree,
          institution,
          from,
          is_current,
          field_of_study,
          description,
        ],
      );
      return res.status(201).json(newEducation.rows[0]);
    }
  } catch (error) {
    return res.status(500).json({ message: "Error creating education" });
  }
};

export const updateEducation = async (req, res) => {
  const { id } = req.params;
  const {
    degree,
    institution,
    from,
    to,
    is_current,
    field_of_study,
    description,
  } = req.body;

  if (!degree || !institution || !from || !field_of_study || !is_current) {
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
          "UPDATE educations SET degree = $2, institution = $3, from = $4, to = $5, is_current = $6, field_of_study = $7, description = $8 WHERE id = $1 RETURNING *",
          [
            id,
            degree,
            institution,
            from,
            to,
            is_current,
            field_of_study,
            description,
          ],
        );
        return res.status(201).json(newEducation.rows[0]);
      }
    } else {
      const newEducation = await db.query(
        "UPDATE educations SET degree = $2, institution = $3, from = $4, is_current = $5, field_of_study = $6, description = $7 WHERE id = $1 RETURNING *",
        [
          id,
          degree,
          institution,
          from,
          is_current,
          field_of_study,
          description,
        ],
      );
      return res.status(201).json(newEducation.rows[0]);
    }
  } catch (error) {
    return res.status(500).json({ message: "Error updating education" });
  }
};

export const deleteEducation = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM educations WHERE id = $1", [id]);
    return res.status(200).json({ message: "Education deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error deleting education" });
  }
};
