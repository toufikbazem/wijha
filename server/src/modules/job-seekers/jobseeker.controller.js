import db from "../../config/db.js";

export const getJobSeekerProfile = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Job seeker ID is required" });
  }

  if (req.user.role !== "jobseeker" || req.user.id !== id) {
    return res
      .status(403)
      .json({ message: "You are not authorized to view this profile" });
  }

  try {
    const user = await db.query(
      "SELECT users.*, jobseeker.* FROM user INNER JOIN jobseeker ON users.id = jobseeker.user_id WHERE users.id = $1",
      [id],
    );

    const experience = await db.query(
      "SELECT * FROM experiences WHERE user_id = $1",
      [id],
    );

    const education = await db.query(
      "SELECT * FROM educations WHERE user_id = $1",
      [id],
    );

    const languages = await db.query(
      "SELECT * FROM languages WHERE user_id = $1",
      [id],
    );

    if (user.rows.length === 0) {
      return res.status(404).json({ message: "Job seeker not found" });
    }

    const jobSeekerProfile = user.rows[0];
    return res.status(200).json({
      ...jobSeekerProfile,
      experience: experience.rows,
      education: education.rows,
      languages: languages.rows,
    });
  } catch (error) {
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
    saved,
    applications,
    linkedin,
    github,
    portfolio,
  } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Job seeker ID is required" });
  }

  if (req.user.role !== "jobseeker" || req.user.id !== id) {
    return res
      .status(403)
      .json({ message: "You are not authorized to view this profile" });
  }

  try {
    const result = await db.query(
      "UPDATE jobseeker SET first_name = $1, last_name = $2, professional_title = $3, gender = $4, address = $5, phone_number = $6, profile_image = $7, professional_summary = $8, experience_years = $9, CV = $10, skills = $11, saved = $12, applications = $13, linkedin = $14, github = $15, portfolio = $16 WHERE user_id = $17 AND status = 'active' RETURNING *",
      [
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
        saved,
        applications,
        linkedin,
        github,
        portfolio,
        id,
      ],
    );

    return res.status(200).json(result.rows[0]);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error updating job seeker profile" });
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
