import Worklog from "../models/worklog.model.js";

//Create WorkLog
export const createWorklog = async (req, res) => {
  try {
    const log = await Worklog.create({
      employee: req.user.id,
      description: req.body.description,
      task: req.body.task,
      screenShot: req.file?.path,
    });

    return res.status(201).json({ message: "Worklog Done", log });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//Get All WorkLog
export const getWorkLogs = async (req, res) => {
  try {
    const logs = await Worklog.find().populate("employee task");
    return res.status(200).json({ message: "Data Fetch", logs });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//Update WorkLogs Status
export const updateMyWorklog = async (req, res) => {
  try {
    const log = await Worklog.findById(req.params.id);

    if (!log) {
      return res.status(404).json({ message: "Worklog not found" });
    }

    if (log.employee.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    log.description = req.body.description || log.description;
    log.task = req.body.task || log.task;

    if (req.file) {
      log.screenShot = req.file.path;
    }

    await log.save();

    return res.status(200).json({ message: "Updated successfully", log });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


//Delete WorkLogs
export const deleteWorkLog = async (req, res) => {
  try {
    await Worklog.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "Deleted log" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
