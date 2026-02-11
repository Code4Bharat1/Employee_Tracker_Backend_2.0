
import Module from "../models/module.model.js";

export const createModule = async (req, res) => {
  try {
    const module = await Module.create(req.body);
    res.status(201).json(module);
  } catch (error) {
    res.status(500).json({ message: "Module creation failed" });
  }
};

export const getModules = async (req, res) => {
  try {
    const modules = await Module.find();
    res.status(200).json(modules);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch modules" });
  }
};

export const updateModule = async (req, res) => {
  try {
    const module = await Module.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(module);
  } catch (error) {
    res.status(500).json({ message: "Module update failed" });
  }
};

export const deleteModule = async (req, res) => {
  try {
    await Module.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Module deleted" });
  } catch (error) {
    res.status(500).json({ message: "Module deletion failed" });
  }
};
