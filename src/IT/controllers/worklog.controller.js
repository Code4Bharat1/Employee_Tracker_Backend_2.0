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
export const updateWorkLogsStatus = async (req, res) => {
  try {
    const log = await Worklog.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true },
    );

    return res.status(200).json({ message: "log Updated", log });
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
