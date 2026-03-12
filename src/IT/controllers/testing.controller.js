import TestingProject from "../models/testingProject.model.js";
import Bug from "../models/bug.model.js";
import TesterScore from "../models/testerScore.model.js";

// DASHBOARD
export const getTestingDashboard = async (req, res) => {
  try {
    const projects = await TestingProject.find().sort({ updatedAt: -1 });

    const totalProjects = projects.length;

    const testingCompleted = projects.filter((p) => p.progress === 100).length;

    const pendingTesting = projects.filter((p) => p.progress === 0).length;

    const inProgress = projects.filter(
      (p) => p.progress > 0 && p.progress < 100
    ).length;

    res.json({
      totalProjects,
      testingCompleted,
      pendingTesting,
      inProgress,
      projects,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch dashboard",
      error: error.message,
    });
  }
};

// PROJECTS LIST
export const getTestingProjects = async (req, res) => {
  try {
    const projects = await TestingProject.find().sort({ updatedAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch projects",
      error: error.message,
    });
  }
};

// MARK PHASE COMPLETE (Testing Manager only)
export const markPhaseCompleted = async (req, res) => {
  try {
    const { id } = req.params;
    const { phase } = req.body;

    const project = await TestingProject.findById(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.frozen) {
      return res.status(400).json({ message: "Project is frozen due to bug" });
    }

    if (!project.phases?.[phase]) {
      return res.status(400).json({ message: "Invalid phase" });
    }

    if (!project.phases[phase].validated) {
      return res
        .status(400)
        .json({ message: "Validation required before completion" });
    }

    project.phases[phase].status = "completed";
    project.phases[phase].completedAt = new Date();
    project.phases[phase].completedBy = req.user.id;

    // optional progress update
    const phases = Object.values(project.phases || {});
    const completedCount = phases.filter((x) => x.status === "completed").length;
    project.progress = Math.round((completedCount / phases.length) * 100);

    await project.save();

    await TesterScore.findOneAndUpdate(
      { testerId: req.user.id },
      { testerName: req.user.name || "Tester", $inc: { impact: 2 } },
      { upsert: true, new: true }
    );

    res.json(project);
  } catch (error) {
    res.status(500).json({
      message: "Failed to complete phase",
      error: error.message,
    });
  }
};

// VALIDATE PHASE (Testing Manager only)
export const validatePhase = async (req, res) => {
  try {
    const { id } = req.params;
    const { phase, validated } = req.body;

    const project = await TestingProject.findById(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (!project.phases?.[phase]) {
      return res.status(400).json({ message: "Invalid phase" });
    }

    project.phases[phase].validated = Boolean(validated);
    await project.save();

    res.json(project);
  } catch (error) {
    res.status(500).json({
      message: "Failed to validate phase",
      error: error.message,
    });
  }
};

// CREATE BUG (Testing Manager)
export const createBug = async (req, res) => {
  try {
    const { testingProjectId, phase, title, description } = req.body;

    const project = await TestingProject.findById(testingProjectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const phaseObj = project.phases?.[phase];
    if (!phaseObj) {
      return res.status(400).json({ message: "Invalid phase" });
    }

    const createdAfterPhaseComplete = phaseObj.status === "completed";

    project.phases[phase].status = "bug_found";
    project.frozen = true;
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

    if (createdAfterPhaseComplete) {
      await TesterScore.findOneAndUpdate(
        { testerId: req.user.id },
        { testerName: req.user.name || "Tester", $inc: { impact: -3 } },
        { upsert: true, new: true }
      );
    }

    res.json({ bug, project });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create bug",
      error: error.message,
    });
  }
};

// UPDATE BUG STATUS (Testing Manager)
export const updateBugStatus = async (req, res) => {
  try {
    const { bugId } = req.params;
    const { status } = req.body;

    const bug = await Bug.findById(bugId).populate("testingProject");
    if (!bug) {
      return res.status(404).json({ message: "Bug not found" });
    }

    bug.status = status;
    await bug.save();

    res.json(bug);
  } catch (error) {
    res.status(500).json({
      message: "Failed to update bug status",
      error: error.message,
    });
  }
};

// BUG LIST
export const getBugs = async (req, res) => {
  try {
    const bugs = await Bug.find().sort({ createdAt: -1 });
    res.json(bugs);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch bugs",
      error: error.message,
    });
  }
};

// LEADERBOARD
export const getLeaderboard = async (req, res) => {
  try {
    const rows = await TesterScore.find().sort({ impact: -1 });
    res.json(rows);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch leaderboard",
      error: error.message,
    });
  }
};