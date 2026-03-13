import Rating from "../models/rating.model.js";

export const getRatings = async (req, res) => {
  try {

    const { employee, decision, from, to } = req.query;

    const filter = {};

    if (employee) filter.employee = employee;
    if (decision) filter.decision = decision;

    if (from || to) {
      filter.reviewedAt = {};
      if (from) filter.reviewedAt.$gte = new Date(from);
      if (to) filter.reviewedAt.$lte = new Date(to);
    }

    const ratings = await Rating.find(filter)
      .populate("employee module project createdBy")
      .sort({ reviewedAt: -1 });

    res.status(200).json({
      success: true,
      ratings
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Fetch failed" });
  }
};


export const getEmployeeRatingSummary = async (req, res) => {

  try {

    const employeeId = req.params.employeeId;

    const ratings = await Rating.find({
      employee: employeeId
    }).select("points10 decision");

    const totalCount = ratings.length;

    const totalPoints = ratings.reduce(
      (sum, r) => sum + (r.points10 || 0),
      0
    );

    const averageScore = totalCount
      ? Number((totalPoints / totalCount).toFixed(2))
      : 0;

    const approvedCount = ratings.filter(
      r => r.decision === "APPROVED"
    ).length;

    const rejectedCount = ratings.filter(
      r => r.decision === "REJECTED"
    ).length;

    res.status(200).json({
      employeeId,
      stats: {
        totalModulesReviewed: totalCount,
        approvedModules: approvedCount,
        rejectedModules: rejectedCount,
        totalPoints,
        averageScore
      }
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Summary failed"
    });

  }

};