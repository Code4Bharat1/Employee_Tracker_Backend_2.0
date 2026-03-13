import Module from "../models/module.model.js";
import Rating from "../models/rating.model.js";
import { MODULE_STATUS } from "../utils/constants.js";

/* CREATE MODULE */

export const createModule = async (req, res) => {
  try {

    const module = await Module.create(req.body);

    res.status(201).json(module);

  } catch (error) {

    console.log("MODULE CREATE ERROR:", error);

    res.status(500).json({
      message: "Creation Failed",
      error: error.message
    });

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
    if (req.body.status === MODULE_STATUS.COMPLETED) {
      req.body.completedAt = new Date();
    }

    const module = await Module.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.status(200).json(module);
  } catch (error) {
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
    const { decision, reason } = req.body;

    const module = await Module.findById(req.params.id).populate(
      "assignedTo project",
    );

    if (!module) {
      return res.status(404).json({ message: "Module not found" });
    }

    if (module.status !== MODULE_STATUS.COMPLETED) {
      return res.status(400).json({
        message: "Module must be COMPLETED before review",
      });
    }

    /* approve or reject */

    if (decision === "APPROVED") {
      module.status = MODULE_STATUS.APPROVED;
    } else {
      module.status = MODULE_STATUS.IN_PROGRESS;
      module.reworkCount += 1;
    }

    await module.save();

    /* ===== SCORE CALCULATION ===== */

    const modules = await Module.find({
      assignedTo: module.assignedTo,
      project: module.project,
    });

    const basePoints = 10 / modules.length;

    let points10 = basePoints;

    if (module.completedAt > module.deadline) {
      points10 = basePoints * 0.5;
    }

    if (decision === "REJECTED") {
      points10 = -basePoints;
    }

    /* ===== SAVE RATING ===== */

    const rating = await Rating.findOneAndUpdate(
      { module: module._id },

      {
        employee: module.assignedTo,
        module: module._id,
        project: module.project,
        type: "MODULE",
        decision,
        points10,
        reason,
        createdBy: req.user?.id,
        reviewedAt: new Date(),
      },

      { new: true, upsert: true },
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
