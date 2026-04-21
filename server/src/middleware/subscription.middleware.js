import db from "../config/db.js";

/**
 * Middleware that checks if the employer has an active subscription
 * with remaining capacity for the given action.
 *
 * @param {"job_post" | "profile_access"} action - which limit to check
 */
export const requireSubscription = (action) => {
  return async (req, res, next) => {
    // Only enforce for employers — admins bypass
    if (req.user.role !== "employer") {
      return next();
    }

    try {
      const employerResult = await db.query(
        "SELECT id FROM employers WHERE user_id = $1",
        [req.user.userId],
      );

      if (employerResult.rows.length === 0) {
        return res.status(404).json({ message: "Employer not found" });
      }

      const employerId = employerResult.rows[0].id;

      // Fetch active subscription with plan + usage
      const result = await db.query(
        `SELECT
           s.*,
           sp.type AS plan_type,
           sp.job_post_limit,
           sp.profile_access_limit,
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
        return res.status(403).json({
          message: "No active subscription",
          code: "NO_SUBSCRIPTION",
        });
      }

      const sub = result.rows[0];

      // Unlimited plans skip limit checks
      if (sub.plan_type !== "unlimited") {
        if (action === "job_post") {
          const limit = sub.is_custom
            ? sub.custom_job_post_limit
            : sub.job_post_limit;
          if (Number(sub.job_post_used) >= limit) {
            return res.status(403).json({
              message: "Job post limit reached",
              code: "LIMIT_REACHED",
            });
          }
        }

        if (action === "profile_access") {
          const limit = sub.is_custom
            ? sub.custom_profile_access_limit
            : sub.profile_access_limit;
          if (Number(sub.profile_access_used) >= limit) {
            return res.status(403).json({
              message: "Profile access limit reached",
              code: "LIMIT_REACHED",
            });
          }
        }
      }

      // Attach subscription info so the controller can use it
      req.subscription = {
        id: sub.id,
        plan_type: sub.plan_type,
      };

      next();
    } catch (error) {
      console.error("Subscription middleware error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
};
