// Compute a profile completion percentage from a list of field "checks".
// Each entry in `fields` is a boolean indicating whether that field is filled.
// Returns a rounded 0–100 integer.
export const computeCompletion = (fields) => {
  if (!fields.length) return 0;
  const filled = fields.filter(Boolean).length;
  return Math.round((filled / fields.length) * 100);
};

// Compute a weighted profile completion percentage.
// Each entry is `{ filled: boolean, weight: number }`; a field contributes its
// `weight` toward the total only when it is filled. Returns a rounded 0–100
// integer (relative to the sum of all weights).
export const computeWeightedCompletion = (fields) => {
  const totalWeight = fields.reduce((sum, f) => sum + (f.weight || 0), 0);
  if (totalWeight <= 0) return 0;
  const earned = fields.reduce(
    (sum, f) => sum + (f.filled ? f.weight || 0 : 0),
    0,
  );
  return Math.round((earned / totalWeight) * 100);
};

// A string field counts as filled when it has non-whitespace content.
export const hasText = (value) =>
  typeof value === "string" ? value.trim() !== "" : value != null && value !== "";

// An array field counts as filled when it has at least one element.
export const hasItems = (value) => Array.isArray(value) && value.length > 0;
