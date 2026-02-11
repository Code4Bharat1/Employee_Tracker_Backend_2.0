
import Worklog from "../models/worklog.model.js";

export const createWorklog = async (req, res) => {
  try {
    const log = await Worklog.create({
      employee: req.user.id,
      description: req.body.description,
      screenshot: req.file?.path,
    });
    res.status(201).json(log);
  } catch (error) {
    res.status(500).json({ message: "Worklog creation failed" });
  }
};

export const getWorklogs = async (req, res) => {
  try {
    const logs = await Worklog.find().populate("employee");
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch worklogs" });
  }
};

export const updateWorklogStatus = async (req, res) => {
  try {
    const log = await Worklog.findByIdAndUpdate(
      req.params.id,
      req.body,
      { status: req.body.status },
      { new: true }
    );
    res.status(200).json(log);
  } catch (error) {
    res.status(500).json({ message: "Status update failed" });
  }
};

export const deleteWorklog = async (req, res) => {
  try {
    await Worklog.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Worklog deleted" });
  } catch (error) {
    res.status(500).json({ message: "Worklog deletion failed" });
  }
};

