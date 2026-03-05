import TestingProject from "../models/testingProject.model.js";
import Bug from "../models/bug.model.js";
import TesterScore from "../models/testerScore.model.js";

//  DASHBOARD
export const getTestingDashboard = async (req, res) => {
  const projects = await TestingProject.find();

  const projectsInTesting = projects.length;
  const frozenProjects = projects.filter((p) => p.frozen).length;

  const phasesCompleted = projects.reduce((acc, p) => {
    const phases = Object.values(p.phases);
    return acc + phases.filter((x) => x.status === "completed").length;
  }, 0);

  const completed100 = projects.filter((p) => p.progress === 100).length;

  // alerts simple (latest 5 bugs)
  const latestBugs = await Bug.find().sort({ createdAt: -1 }).limit(5);

  res.json({
    projectsInTesting,
    frozenProjects,
    phasesCompleted,
    completed100,
    alerts: latestBugs.map((b) => ({
      tag: b.status === "OPEN" ? "RED" : "GREEN",
      text: `${b.projectName} - ${b.title} (${b.phase})`,
    })),
  });
};

//  PROJECTS LIST
export const getTestingProjects = async (req, res) => {
  const projects = await TestingProject.find().sort({ updatedAt: -1 });
  res.json(projects);
};

//  MARK PHASE COMPLETE (Testing Manager only)
export const markPhaseCompleted = async (req, res) => {
  const { id } = req.params; // testingProject id
  const { phase } = req.body; // frontend/backend/cyber/seo

  const project = await TestingProject.findById(id);
  if (!project) return res.status(404).json({ message: "Project not found" });

  // RULE: freeze means cannot progress
  if (project.frozen) {
    return res.status(400).json({ message: "Project is frozen due to bug" });
  }

  // RULE: validation required
  if (!project.phases?.[phase]) {
    return res.status(400).json({ message: "Invalid phase" });
  }
  if (!project.phases[phase].validated) {
    return res.status(400).json({ message: "Validation required before completion" });
  }

  project.phases[phase].status = "completed";
  project.phases[phase].completedAt = new Date();
  project.phases[phase].completedBy = req.user.id;

  await project.save();

  // rating + (clean testing)
  await TesterScore.findOneAndUpdate(
    { testerId: req.user.id },
    { testerName: req.user.name || "Tester", $inc: { impact: 2 } },
    { upsert: true, new: true }
  );

  res.json(project);
};

//  VALIDATE PHASE (Testing Manager only)
export const validatePhase = async (req, res) => {
  const { id } = req.params;
  const { phase, validated } = req.body;

  const project = await TestingProject.findById(id);
  if (!project) return res.status(404).json({ message: "Project not found" });

  if (!project.phases?.[phase]) {
    return res.status(400).json({ message: "Invalid phase" });
  }

  project.phases[phase].validated = Boolean(validated);
  await project.save();

  res.json(project);
};

//  CREATE BUG (Testing Manager)
export const createBug = async (req, res) => {
  const { testingProjectId, phase, title, description } = req.body;

  const project = await TestingProject.findById(testingProjectId);
  if (!project) return res.status(404).json({ message: "Project not found" });

  const phaseObj = project.phases?.[phase];
  if (!phaseObj) return res.status(400).json({ message: "Invalid phase" });

  const createdAfterPhaseComplete = phaseObj.status === "completed";

  // BUG creates freeze
  project.phases[phase].status = "bug_found";
  await project.save();

  const bug = await Bug.create({
    testingProject: project._id,
    projectName: project.name,
    phase,
    title,
    description,
    createdAfterPhaseComplete,
    createdBy: req.user.id,
  });

  // rating - if post completion bug
  if (createdAfterPhaseComplete) {
    await TesterScore.findOneAndUpdate(
      { testerId: req.user.id },
      { testerName: req.user.name || "Tester", $inc: { impact: -3 } },
      { upsert: true, new: true }
    );
  }

  res.json({ bug, project });
};

//  UPDATE BUG STATUS (Testing Manager)
export const updateBugStatus = async (req, res) => {
  const { bugId } = req.params;
  const { status } = req.body;

  const bug = await Bug.findById(bugId).populate("testingProject");
  if (!bug) return res.status(404).json({ message: "Bug not found" });

  bug.status = status;
  await bug.save();

  res.json(bug);
};

//  BUG LIST
export const getBugs = async (req, res) => {
  const bugs = await Bug.find().sort({ createdAt: -1 });
  res.json(bugs);
};

//  LEADERBOARD
export const getLeaderboard = async (req, res) => {
  const rows = await TesterScore.find().sort({ impact: -1 });
  res.json(rows);
};