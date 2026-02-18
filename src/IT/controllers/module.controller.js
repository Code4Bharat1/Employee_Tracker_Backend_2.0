import  Module  from "../models/module.model.js";
import { calculateScore10 } from "../utils/score.util.js";
import Rating from "../models/rating.model.js";

export const createModule = async (req, res) =>{
try {
    const module = await Module.create(req.body);
    res.status(201).json(module);
} catch {
    res.status(500).json({ message: "Cretion Failed" });
}
};

export  const getModules = async (req,res) => {
    try {
        const modules = await Module.find().populate("project assignedTo");
        res.status(200).json(modules);
    } catch {
        res.status(500).json({ message: "Fetch failed" });
        
    }
};

export const updateModule = async (req,res)=>{
    try {
        const module = await Module.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.status(200).json(module);
    } catch(error) {
        console.log(error);
        res.status(500).json({ message: "Upadate failed" });
        
    }
};

export const deleteModule = async (req,res) =>{
    try {
        await module.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Delete" });
    } catch{
        res.status(500).json({message: "Delete failed" });
    }
};

export const reviewModule = async (req, res) => {
  try {
    const { decision, deduction10, reason } = req.body;
    // decision: "APPROVED" | "REJECTED"
    if (!decision) {
      return res.status(400).json({ message: "decision is required" });
    }

    const module = await Module.findById(req.params.id).populate("assignedTo project");
    if (!module) return res.status(404).json({ message: "Module not found" });

    if (module.status !== "COMPLETED") {
      return res.status(400).json({ message: "Module must be COMPLETED before review" });
    }

    // first-time approval check BEFORE updating reviewStatus
    const firstTimeApproval = module.reviewStatus === "PENDING";

    module.reviewStatus = decision;
    module.reviewedBy = req.user?.id;
    module.reviewedAt = new Date();

    if (decision === "APPROVED") {
      module.status = "APPROVED";
    } else {
      module.status = "IN_PROGRESS"; // send back for rework
      module.reworkCount = (module.reworkCount || 0) + 1; // if field exists
    }

    await module.save();

    // ✅ points logic (AUTO)
    let points10 = 0;

    if (decision === "APPROVED") {
      points10 = calculateScore10({
        deadline: module.deadline,              // if exists
        completedAt: module.completedAt || module.updatedAt, // best available
        reworkCount: module.reworkCount || 0,   // if exists
        bugCount: module.bugCount || 0,         // optional
        firstTimeApproval,
        base: 9, // module base score higher than task
      });
    } else {
      points10 = -1 * (typeof deduction10 === "number" ? deduction10 : 3); // default -3
    }

    // ✅ Upsert one rating per module
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

    return res.status(200).json({
      message: `Module ${decision} + auto rating generated`,
      module,
      rating,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Module review failed" });
  }
};