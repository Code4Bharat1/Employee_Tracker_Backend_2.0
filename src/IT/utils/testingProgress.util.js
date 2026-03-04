export const PHASES = ["frontend", "backend", "cyber", "seo"];

export const calcProgress = (phases = {}) => {
  // phases = { frontend: {status:'completed'}, backend: {...} }
  let completed = 0;

  for (const key of PHASES) {
    if (phases?.[key]?.status === "completed") completed++;
  }
  return completed * 25; // 25% each
};

export const isFrozen = (phases = {}) => {
  return Object.values(phases).some((p) => p.status === "bug_found");
};