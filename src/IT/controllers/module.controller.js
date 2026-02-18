import  Module  from "../models/module.model.js";
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
    const { decision, score10, deduction10, reason } = req.body;

    const module = await Module.findById(req.params.id)
      .populate("assignedTo project");

    if (!module) return res.status(404).json({ message: "Module not found" });

    if (module.status !== "COMPLETED") {
      return res.status(400).json({ message: "Module must be completed first" });
    }

    module.reviewStatus = decision;
    module.reviewedBy = req.user?.id;
    module.reviewedAt = new Date();

    if (decision === "APPROVED") {
      module.status = "APPROVED";
    } else {
      module.status = "IN_PROGRESS";
    }

    await module.save();

    const points =
      decision === "APPROVED"
        ? (typeof score10 === "number" ? score10 : 9)
        : -1 * (typeof deduction10 === "number" ? deduction10 : 3);

    const rating = await Rating.findOneAndUpdate(
      { module: module._id, type: "MODULE" },
      {
        employee: module.assignedTo?._id,
        module: module._id,
        project: module.project,
        type: "MODULE",
        decision,
        points10: points,
        reason,
        createdBy: req.user?.id,
        reviewedAt: new Date(),
      },
      { new: true, upsert: true }
    );

    res.json({ message: `Module ${decision}`, module, rating });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Module review failed" });
  }
};