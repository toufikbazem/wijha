import db from "../../config/db.js";

// GET /plans — public, list all available plans
export const getPlans = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT * FROM subscription_plans ORDER BY price ASC`,
    );
    return res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching plans:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// GET /my-subscription — employer, get active subscription + usage
export const getMySubscription = async (req, res) => {
  const userId = req.user.userId;

  try {
    const employerResult = await db.query(
      "SELECT id FROM employers WHERE user_id = $1",
      [userId],
    );

    if (employerResult.rows.length === 0) {
      return res.status(404).json({ message: "Employer not found" });
    }

    const employerId = employerResult.rows[0].id;

    const result = await db.query(
      `SELECT
         s.*,
         sp.name AS plan_name,
         sp.type AS plan_type,
         sp.duration AS plan_duration,
         sp.price AS plan_price,
         sp.job_post_limit AS plan_job_post_limit,
         sp.profile_access_limit AS plan_profile_access_limit,
         COALESCE(su.job_post_used, 0) AS job_post_used,
         COALESCE(su.profile_access_used, 0) AS profile_access_used
       FROM subscriptions s
       INNER JOIN subscription_plans sp ON s.plan_id = sp.id
       LEFT JOIN subscription_usage su ON su.subscription_id = s.id
       WHERE s.employer_id = $1
         AND s.status = 'active'
         AND s.end_day >= CURRENT_DATE
       ORDER BY s.created_at DESC
       LIMIT 1`,
      [employerId],
    );

    if (result.rows.length === 0) {
      return res.status(200).json({ subscription: null });
    }

    const sub = result.rows[0];

    // Determine effective limits
    const jobPostLimit = sub.is_custom
      ? sub.custom_job_post_limit
      : sub.plan_job_post_limit;
    const profileAccessLimit = sub.is_custom
      ? sub.custom_profile_access_limit
      : sub.plan_profile_access_limit;

    return res.status(200).json({
      subscription: {
        id: sub.id,
        plan_name: sub.plan_name,
        plan_type: sub.plan_type,
        price: sub.plan_price,
        status: sub.status,
        start_day: sub.start_day,
        end_day: sub.end_day,
        is_custom: sub.is_custom,
        job_post_used: Number(sub.job_post_used),
        job_post_limit: jobPostLimit,
        profile_access_used: Number(sub.profile_access_used),
        profile_access_limit: profileAccessLimit,
      },
    });
  } catch (error) {
    console.error("Error fetching subscription:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// POST /subscribe — employer, create a new subscription
export const subscribe = async (req, res) => {
  const userId = req.user.userId;
  const { plan_id } = req.body;

  if (!plan_id) {
    return res.status(400).json({ message: "plan_id is required" });
  }

  try {
    const employerResult = await db.query(
      "SELECT id FROM employers WHERE user_id = $1",
      [userId],
    );

    if (employerResult.rows.length === 0) {
      return res.status(404).json({ message: "Employer not found" });
    }

    const employerId = employerResult.rows[0].id;

    // Fetch the plan
    const planResult = await db.query(
      "SELECT * FROM subscription_plans WHERE id = $1",
      [plan_id],
    );

    if (planResult.rows.length === 0) {
      return res.status(404).json({ message: "Plan not found" });
    }

    const plan = planResult.rows[0];

    // Check for existing active subscription
    const existing = await db.query(
      `SELECT id FROM subscriptions
       WHERE employer_id = $1 AND status = 'active' AND end_day >= CURRENT_DATE`,
      [employerId],
    );

    if (existing.rows.length > 0) {
      return res
        .status(409)
        .json({ message: "You already have an active subscription" });
    }

    // Create subscription
    const startDay = new Date();
    const endDay = new Date();
    endDay.setDate(endDay.getDate() + plan.duration);

    const subResult = await db.query(
      `INSERT INTO subscriptions (employer_id, plan_id, start_day, end_day, status)
       VALUES ($1, $2, $3, $4, 'active')
       RETURNING *`,
      [employerId, plan_id, startDay, endDay],
    );

    const subscription = subResult.rows[0];

    // Create usage record
    await db.query(
      `INSERT INTO subscription_usage (subscription_id, job_post_used, profile_access_used)
       VALUES ($1, 0, 0)`,
      [subscription.id],
    );

    return res.status(201).json({
      message: "Subscription created successfully",
      subscription: {
        ...subscription,
        plan_name: plan.name,
        plan_type: plan.type,
      },
    });
  } catch (error) {
    console.error("Error creating subscription:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// GET /invoices — employer, list past subscriptions
export const getInvoices = async (req, res) => {
  const userId = req.user.userId;

  try {
    const employerResult = await db.query(
      "SELECT id FROM employers WHERE user_id = $1",
      [userId],
    );

    if (employerResult.rows.length === 0) {
      return res.status(404).json({ message: "Employer not found" });
    }

    const employerId = employerResult.rows[0].id;

    const result = await db.query(
      `SELECT
         s.id,
         s.start_day,
         s.end_day,
         s.status,
         s.created_at,
         sp.name AS plan_name,
         sp.type AS plan_type,
         sp.price,
         COALESCE(su.job_post_used, 0) AS job_post_used,
         COALESCE(su.profile_access_used, 0) AS profile_access_used
       FROM subscriptions s
       INNER JOIN subscription_plans sp ON s.plan_id = sp.id
       LEFT JOIN subscription_usage su ON su.subscription_id = s.id
       WHERE s.employer_id = $1
       ORDER BY s.created_at DESC`,
      [employerId],
    );

    return res.status(200).json({ invoices: result.rows });
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
