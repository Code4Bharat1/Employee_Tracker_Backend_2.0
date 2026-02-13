import Worklog from "../models/worklog.model.js";
import Rating from "../models/rating.model.js";

//  Calculate Employee Rating 
export const getEmployeerating = async (req, res) => {
  try {
    const logs = await Worklog.find({ employee: req.params.id });

    let score = 0;
    let approvedCount = 0;
    let rejectedCount = 0;

    logs.forEach((log) => {
      if (log.status === "APPROVED") {
        score += 5;
        approvedCount++;
      }

      if (log.status === "REJECTED") {
        score -= 2;
        rejectedCount++;
      }
    });

    res.status(200).json({
      employee: req.params.id,
      approvedCount,
      rejectedCount,
      score
    });

  } catch (error) {
    res.status(500).json({ message: "Rating Calculation Failed", error: error.message });
  }
};

//  Generate & Save Rating in Database
export const generateRating = async (req, res) => {
  try {
    const { employee, period } = req.body;

    const logs = await Worklog.find({ employee });

    let approvedCount = 0;
    let rejectedCount = 0;
    let score = 0;

    logs.forEach((log) => {
      if (log.status === "APPROVED") {
        approvedCount++;
        score += 5;
      }

      if (log.status === "REJECTED") {
        rejectedCount++;
        score -= 2;
      }
    });

    const rating = await Rating.create({
      employee,
      period,
      approvedCount,
      rejectedCount,
      score,
      generatedBy: req.user.id
    });

    res.status(201).json(rating);

  } catch (error) {
    res.status(500).json({ message: "Rating Generation Failed", error: error.message });
  }
};

//  Get All Ratings
export const getAllRatings = async (req, res) => {
  try {
    const ratings = await Rating.find()
      .populate("employee", "name email role")
      .populate("generatedBy", "name role");

    res.status(200).json(ratings);

  } catch (error) {
    res.status(500).json({ message: "Failed to fetch ratings", error: error.message });
  }
};

// Delete Rating
export const deleteRating = async (req, res) => {
  try {
    const rating = await Rating.findByIdAndDelete(req.params.id);

    if (!rating) {
      return res.status(404).json({ message: "Rating not found" });
    }

    res.status(200).json({ message: "Rating deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: "Rating deletion failed", error: error.message });
  }
};
