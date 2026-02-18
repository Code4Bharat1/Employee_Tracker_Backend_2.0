// src/utils/score.util.js
export const clamp10 = (n) => Math.max(0, Math.min(10, n));

export const calculateScore10 = ({
  deadline,
  completedAt,
  reworkCount = 0,
  bugCount = 0,
  firstTimeApproval = true,
  base = 8,
}) => {
  let score = base;

  // ✅ deadline logic
  if (deadline) {
    const d = new Date(deadline);
    const c = completedAt ? new Date(completedAt) : new Date();

    if (c <= d) score += 1;     // on/before deadline
    else score -= 2;            // late
  }

  // 🔁 rework penalty
  score -= Number(reworkCount || 0);

  // 🐞 bug penalty (every 2 bugs => -1)
  score -= Math.ceil(Number(bugCount || 0) / 2);

  // ⭐ bonus if approved in first review
  if (firstTimeApproval) score += 1;

  return clamp10(score);
};
