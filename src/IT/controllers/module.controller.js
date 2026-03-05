import Module from "../models/module.model.js";
import { calculateScore10 } from "../utils/score.util.js";
import Rating from "../models/rating.model.js";

/* ================= CREATE MODULE ================= */

export const createModule = async (req, res) => {
  try {
    const module = await Module.create(req.body);
    res.status(201).json(module);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Creation Failed" });
  }
};

/* ================= GET MODULES ================= */

export const getModules = async (req, res) => {
  try {
    const modules = await Module.find().populate("project assignedTo");
    res.status(200).json(modules);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Fetch failed" });
  }
};

/* ================= UPDATE MODULE ================= */

export const updateModule = async (req, res) => {
  try {
    const module = await Module.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json(module);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Update failed" });
  }
};

/* ================= DELETE MODULE ================= */

export const deleteModule = async (req, res) => {
  try {
    await Module.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Delete failed" });
  }
};

/* ================= REVIEW MODULE ================= */

export const reviewModule = async (req, res) => {
  try {
    const { decision, deduction10, reason } = req.body;

    if (!decision) {
      return res.status(400).json({ message: "decision is required" });
    }

    const module = await Module.findById(req.params.id).populate(
      "assignedTo project"
    );

    if (!module) {
      return res.status(404).json({ message: "Module not found" });
    }

    if (module.status !== "COMPLETED") {
      return res
        .status(400)
        .json({ message: "Module must be COMPLETED before review" });
    }

    if (decision === "APPROVED") {
      module.status = "APPROVED";
    } else {
      module.status = "IN_PROGRESS";
      module.reworkCount = (module.reworkCount || 0) + 1;
    }

    await module.save();

    /* ===== SCORE LOGIC ===== */

    let points10 = 0;

    if (decision === "APPROVED") {
      points10 = calculateScore10({
        deadline: module.deadline,
        completedAt: module.updatedAt,
        reworkCount: module.reworkCount || 0,
        bugCount: module.bugCount || 0,
        base: 9,
      });
    } else {
      points10 = -1 * (typeof deduction10 === "number" ? deduction10 : 3);
    }

    /* ===== SAVE RATING ===== */

    const rating = await Rating.findOneAndUpdate(
      { module: module._id, type: "MODULE" },
      {
        employee: module.assignedTo?._id,
        module: module._id,
        project: module.project || undefined,
        type: "MODULE",
        decision,
        points10,
        reason,
        createdBy: req.user?.id,
        reviewedAt: new Date(),
      },
      { new: true, upsert: true }
    );

    res.status(200).json({
      message: `Module ${decision} + rating generated`,
      module,
      rating,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Module review failed" });
  }
};