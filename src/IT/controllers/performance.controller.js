import Module from "../models/module.model.js";
import Rating from "../models/rating.model.js";
import User from "../models/user.model.js";
import { MODULE_STATUS } from "../utils/constants.js";
/* ======================================================
   PERFORMANCE STATS
====================================================== */

export const getPerformanceStats = async (req, res) => {
  try {
    const avgScoreResult = await Rating.aggregate([
      { $match: { decision: "APPROVED" } },
      { $group: { _id: null, avgScore: { $avg: "$points10" } } },
    ]);

    const avgScore = avgScoreResult.length
      ? Number(avgScoreResult[0].avgScore.toFixed(2))
      : 0;

    const approvedModules = await Module.countDocuments({
      status: MODULE_STATUS.APPROVED,
    });

    const activeModules = await Module.countDocuments({
      status: {
        $in: [MODULE_STATUS.IN_PROGRESS, MODULE_STATUS.COMPLETED],
      },
    });

    const activeEmployees = await User.countDocuments({
      role: "DEVELOPER",
    });

    res.json({
      avgScore,
      approvedModules,
      activeModules,
      activeEmployees,
    });
  } catch (error) {
    res.status(500).json({ message: "Stats failed" });
  }
};

/* ======================================================
   MODULE COMPLETION TREND
   (Replacement for Worklog Intensity)
====================================================== */

export const getModuleTrend = async (req, res) => {
  const trend = await Module.aggregate([
    { $match: { status: MODULE_STATUS.APPROVED } },

    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$updatedAt",
          },
        },
        modules: { $sum: 1 },
      },
    },

    { $sort: { _id: 1 } },
  ]);

  res.json(trend);
};

/* ======================================================
   PROJECT LEADERBOARD
====================================================== */

export const getProjectLeaderboard = async (req, res) => {
  const data = await Rating.aggregate([
    { $match: { decision: "APPROVED" } },

    {
      $group: {
        _id: "$project",
        avgScore: { $avg: "$points10" },
      },
    },

    {
      $lookup: {
        from: "it_projects",
        localField: "_id",
        foreignField: "_id",
        as: "project",
      },
    },

    { $unwind: "$project" },

    {
      $project: {
        name: "$project.name",
        score: { $round: ["$avgScore", 2] },
      },
    },

    { $sort: { score: -1 } },
    { $limit: 5 },
  ]);

  res.json(data);
};

/* ======================================================
   TOP PERFORMERS
====================================================== */

export const getTopPerformers = async (req, res) => {
  const data = await Rating.aggregate([
    { $match: { decision: "APPROVED" } },

    {
      $group: {
        _id: "$employee",
        avgScore: { $avg: "$points10" },
        modules: { $sum: 1 },
      },
    },

    {
      $lookup: {
        from: "it_users",
        localField: "_id",
        foreignField: "_id",
        as: "employee",
      },
    },

    { $unwind: "$employee" },

    {
      $project: {
        name: "$employee.name",
        score: { $round: ["$avgScore", 2] },
        modules: 1,
      },
    },

    { $sort: { score: -1 } },
    { $limit: 5 },
  ]);

  res.json(data);
};
