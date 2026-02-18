
import Rating from "../models/rating.model.js";

export const getRatings = async (req, res) => {
  try {
    const { employee, type, decision, from, to } = req.query;

    const filter = {};
    if (employee) filter.employee = employee;
    if (type) filter.type = type;
    if (decision) filter.decision = decision;

    if (from || to) {
      filter.reviewedAt = {};
      if (from) filter.reviewedAt.$gte = new Date(from);
      if (to) filter.reviewedAt.$lte = new Date(to);
    }

    const ratings = await Rating.find(filter)
      .populate("employee task module project createdBy")
      .sort({ reviewedAt: -1, createdAt: -1 });

    return res.status(200).json({ message: "Ratings fetched", ratings });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Fetch failed" });
  }
};


export const getEmployeeRatingSummary = async (req, res) => {
  try {
    const { from, to } = req.query;
    const employeeId = req.params.employeeId;

    const filter = { employee: employeeId };
    if (from || to) {
      filter.reviewedAt = {};
      if (from) filter.reviewedAt.$gte = new Date(from);
      if (to) filter.reviewedAt.$lte = new Date(to);
    }

    const ratings = await Rating.find(filter).select("points10 type decision reviewedAt");

    const totalCount = ratings.length;
    const totalPoints = ratings.reduce((acc, r) => acc + (r.points10 || 0), 0);
    const averageOutOf10 = totalCount ? Number((totalPoints / totalCount).toFixed(2)) : 0;

    const approvedCount = ratings.filter((r) => r.decision === "APPROVED").length;
    const rejectedCount = ratings.filter((r) => r.decision === "REJECTED").length;

    return res.status(200).json({
      message: "Rating summary",
      employeeId,
      stats: {
        totalCount,
        approvedCount,
        rejectedCount,
        totalPoints,
        averageOutOf10,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Summary failed" });
  }
};
