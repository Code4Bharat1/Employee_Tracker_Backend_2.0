import Task from "../models/task.model.js";
import Rating from "../models/rating.model.js";

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

// export const updateTaskStatus = async (req, res) => {
//   try {
//     const task = await Task.findByidAndUpdate(
//       req.params.id,
//       { status: req.body.status },
//       { new: true },
//     );
//     return res.status(200).json(task);
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ message: "Status Update Failed " });
//   }
// }; 

export const reviewTask = async (req, res) => {
  try {
    const { decision, score10, deduction10, reason } = req.body;
    // decision = APPROVED | REJECTED

    const task = await Task.findById(req.params.id)
      .populate("assignedTo module project");

    if (!task) return res.status(404).json({ message: "Task not found" });

    if (task.status !== "COMPLETED") {
      return res.status(400).json({ message: "Task must be completed first" });
    }

    task.reviewStatus = decision;
    task.reviewedBy = req.user?.id;
    task.reviewedAt = new Date();

    if (decision === "APPROVED") {
      task.status = "APPROVED";
    } else {
      task.status = "IN_PROGRESS"; // rework
    }

    await task.save();

    // points logic
    const points =
      decision === "APPROVED"
        ? (typeof score10 === "number" ? score10 : 8)
        : -1 * (typeof deduction10 === "number" ? deduction10 : 2);

    const rating = await Rating.findOneAndUpdate(
      { task: task._id, type: "TASK" },
      {
        employee: task.assignedTo?._id,
        task: task._id,
        module: task.module,
        project: task.project,
        type: "TASK",
        decision,
        points10: points,
        reason,
        createdBy: req.user?.id,
        reviewedAt: new Date(),
      },
      { new: true, upsert: true }
    );

    res.json({ message: `Task ${decision}`, task, rating });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Task review failed" });
  }
};
