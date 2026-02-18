
import Rating from "../models/rating.model.js";
import User from "../models/user.model.js";

export const getWeeklyReport = async (req, res) => {
  try {
    const employeeId = req.params.employeeId;
    const { weekStart } = req.query;

    if (!weekStart) {
      return res.status(400).json({ message: "weekStart is required (YYYY-MM-DD)" });
    }

    const employee = await User.findById(employeeId).select("-password");
    if (!employee) return res.status(404).json({ message: "Employee not found" });

    const start = new Date(weekStart);
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    end.setHours(23, 59, 59, 999);

    const ratings = await Rating.find({
      employee: employeeId,
      reviewedAt: { $gte: start, $lte: end },
    })
      .populate("task module project createdBy")
      .sort({ reviewedAt: 1 });

    const totalCount = ratings.length;
    const totalPoints = ratings.reduce((acc, r) => acc + (r.points10 || 0), 0);
    const weeklyAverageOutOf10 = totalCount ? Number((totalPoints / totalCount).toFixed(2)) : 0;

    const approved = ratings.filter((r) => r.decision === "APPROVED");
    const rejected = ratings.filter((r) => r.decision === "REJECTED");

    const approvedPoints = approved.reduce((acc, r) => acc + (r.points10 || 0), 0);
    const rejectedPoints = rejected.reduce((acc, r) => acc + (r.points10 || 0), 0); // negative sum

    return res.status(200).json({
      message: "Weekly report generated",
      employee,
      week: { start, end },
      stats: {
        totalCount,
        approvedCount: approved.length,
        rejectedCount: rejected.length,
        totalPoints, 
        approvedPoints,
        rejectedPoints, 
        weeklyAverageOutOf10,
      },
      ratings,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Weekly report failed" });
  }
};
