import Worklog from "../models/worklog.model.js";

export const getEmployeerating = async (req, res) => {
  try {
    const logs = await Worklog.find({ employee: req.params.id });

    let score = 0;
    logs.forEach((log) => {
      if (log.status === "APPROVED") score += 5;
      if (log.status === "REJECTED") score - +2;
    });
    res.status(200).json({ rating: score });
  } catch (error) {
    res.status(500).json({ message: "Rating Calculation Failed" });
  }
};
