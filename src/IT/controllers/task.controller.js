import Task from "../models/task.model.js";

export const createTask = async (req, res) => {
  try {
    const task = await Task.create(req.body);
    return res.status(201).json(task);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Task Creation Failed" });
  }
};

export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate("assignedTo");
    console.log(tasks);
    return res.status(200).json(tasks);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Fetch Failed" });
  }
};

export const updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    return res.status(200).json(task);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Update Failed" });
  }
};

export const deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "Task Deleted" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to Delete Task" });
  }
};

export const updateTaskStatus = async (req, res) => {
  try {
    const task = await Task.findByidAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true },
    );
    return res.status(200).json(task);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Status Update Failed " });
  }
};
