import Worklog from "../models/worklog.model.js";
import Task from "../models/task.model.js";

//Project Summary:
export const getProjectSummary = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const totalHoursAgg = await Worklog.aggregate([
      { $match: { project: projectId } },
      {
        $group: {
          _id: "$project",
          totalHours: { $sum: "$hours" },
        },
      },
    ]);

    const totalTasks = await Task.countDocuments({ project: projectId });
    const completedTasks = await Task.countDocuments({
      project: projectId,
      status: "Completed",
    });
    res.status(200).json({
      success: true,
      data: {
        totalHours: totalHoursAgg[0]?.totalHours || 0,
        totalTasks,
        completedTasks,
        pendingTask: totalTasks - completedTasks,
      },
    });
  } catch (error) {
    next(error);
  }
};

//User Summary:
export const getUsersSummary = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const summary = await Worklog.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: "$user",
          totalHours: { $sum: "$hours" },
          totalLogs: { $sum: 1 },
        },
      },
    ]);
    res.status(200).json({
      success: true,
      data: summary[0] || { totalHours: 0, totalLogs: 0 },
    });
  } catch (error) {
    next(error);
  }
};

//WOrklog Report
export const getWorklogReport = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    const filter = {};

    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const logs = await Worklog.find(filter)
      .populate("user", "name email")
      .populate("project", "name")
      .populate("task", "title");

    res.status(200).json({
      success: true,
      count: logs.length,
      data: logs,
    });
  } catch (error) {
    next(error);
  }
};

//Monthly Report
export const getMonthlyReport = async (req, res, next) => {
  try {
    const { year, month } = req.query;

    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0);

    const report = await Worklog.aggregate([
      {
        $match: {
          date: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: "$user",
          totalHours: { $sum: "$hours" },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: report,
    });
  } catch (error) {
    next(error);
  }
};

//Task Status Report
export const getTaskStatusReport = async (req, res, next) => {
  try {
    const report = await Task.aggregate([
      {
        $group: {
          _id: "$status",
          total: { $sum: 1 }
        }
      }
    ]);
    res.status(200).json({
        success:true,
        data:report
    });
  } catch (error) {
    next(error);
  }
};
