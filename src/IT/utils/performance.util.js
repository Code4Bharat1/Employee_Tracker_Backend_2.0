export const calculateModuleScore = (module) => {
  let score = 10;

  score -= module.bugCount * 0.5;
  score -= module.reworkCount * 0.7;

  if (module.completedAt && module.deadline) {
    if (module.completedAt > module.deadline) {
      score -= 1;
    } else {
      score += 1;
    }
  }

  score = Math.max(0, Math.min(10, score));

  return Number(score.toFixed(1));
};

export const determineSkill = (module) => {
  if (module.bugCount <= 1 && module.reworkCount === 0) return "Quality";

  if (module.completedAt && module.completedAt < module.deadline)
    return "Delivery";

  if (module.reworkCount > 3) return "Ownership";

  if (module.bugCount === 0 && module.reworkCount === 0)
    return "Collaboration";

  return "Learning";
};