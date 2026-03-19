import Module from "../models/module.model.js";
import Rating from "../models/rating.model.js";
import { MODULE_STATUS } from "../utils/constants.js";

import {
  calculateModuleScore,
  determineSkill
} from "../utils/performance.util.js";

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
    const module = await Module.findById(req.params.id);

    if (!module) {
      return res.status(404).json({ message: "Module not found" });
    }

    /* ================= STATUS VALIDATION ================= */

    if (req.body.status) {
      const allowedStatuses = [
        MODULE_STATUS.IN_PROGRESS,
        MODULE_STATUS.COMPLETED
      ];

      if (!allowedStatuses.includes(req.body.status)) {
        return res.status(400).json({
          message: "You are not allowed to set this status"
        });
      }
    }

    /* ================= UPDATE DATA ================= */

    Object.assign(module, req.body);

    /* ================= COMPLETED LOGIC ================= */

    if (
      module.status === MODULE_STATUS.COMPLETED &&
      !module.completedAt
    ) {
      module.completedAt = new Date();
    }

    /* ================= SAVE (TRIGGERS PRE SAVE) ================= */

    await module.save();

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
    const { status } = req.body;

    const module = await Module.findById(req.params.id).populate(
      "assignedTo project"
    );

    if (!module) {
      return res.status(404).json({ message: "Module not found" });
    }

    if (module.status !== MODULE_STATUS.COMPLETED) {
      return res.status(400).json({
        message: "Module must be COMPLETED before review",
      });
    }

    /* ================= VALIDATE DECISION ================= */

    if (!["APPROVED", "REJECTED"].includes(status)) {
      return res.status(400).json({ message: "Invalid decision" });
    }

    /* ================= AUTO SCORE ================= */

    const score = calculateModuleScore(module);
    const skill = determineSkill(module);

    /* ================= UPDATE MODULE ================= */

    if (status === "APPROVED") {
      module.status = MODULE_STATUS.APPROVED;
    } else {
      module.status = MODULE_STATUS.IN_PROGRESS;
      module.reworkCount += 1;
    }

    await module.save();

    /* ================= SAVE RATING ================= */

    const rating = await Rating.findOneAndUpdate(
      { module: module._id },
      {
        employee: module.assignedTo,
        module: module._id,
        project: module.project,
        type: "MODULE",
        status,      // ✅ manual
        points10: score, // 🤖 auto
        skill,          // 🤖 auto
        createdBy: req.user?._id,
        reviewedAt: new Date(),
      },
      { new: true, upsert: true }
    );

    res.status(200).json({
      message: `Module ${status} + auto score generated`,
      module,
      rating,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Module review failed" });
  }
};