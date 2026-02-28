// // =======================
// // controllers/task.controller.js
// // =======================
// import Task from "../models/task.model.js";
// import Rating from "../models/rating.model.js";
// import { calculateScore10 } from "../utils/score.util.js";
// import { TASK_STATUS, REVIEW_STATUS } from "../utils/constants.js";

// export const createTask = async (req, res) => {
//   try {
//     const task = await Task.create(req.body);
//     return res.status(201).json(task);
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ message: "Task Creation Failed" });
//   }
// };

// export const getTasks = async (req, res) => {
//   try {
//     const tasks = await Task.find().populate("assignedTo module");
//     return res.status(200).json(tasks);
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ message: "Fetch Failed" });
//   }
// };

// export const updateTask = async (req, res) => {
//   try {
//     const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//     });
//     return res.status(200).json(task);
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ message: "Update Failed" });
//   }
// };

// export const deleteTask = async (req, res) => {
//   try {
//     await Task.findByIdAndDelete(req.params.id);
//     return res.status(200).json({ message: "Task Deleted" });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ message: "Failed to Delete Task" });
//   }
// };

// //  UPDATED: reviewTask 
// export const reviewTask = async (req, res) => {
//   try {
//     const { decision, deduction10, reason } = req.body;

//     //  VALIDATION (fixes decision undefined)
//     if (!decision || !["APPROVED", "REJECTED"].includes(decision)) {
//       return res.status(400).json({
//         message: "decision must be APPROVED or REJECTED",
//       });
//     }

//     const task = await Task.findById(req.params.id).populate("assignedTo module");
//     if (!task) return res.status(404).json({ message: "Task not found" });

//     //  only review if COMPLETED
//     if (task.status !== TASK_STATUS.COMPLETED) {
//       return res
//         .status(400)
//         .json({ message: "Task must be COMPLETED before review" });
//     }

//     //  first-time approval flag
//     const firstTimeApproval = task.reviewStatus === REVIEW_STATUS.PENDING;

//     //  save review info
//     task.reviewStatus = decision; // must match your REVIEW_STATUS values
//     task.reviewedBy = req.user?.id;
//     task.reviewedAt = new Date();

//     //  status update based on decision
//     if (decision === "APPROVED") {
//       task.status = TASK_STATUS.APPROVED;
//     } else {
//       task.status = TASK_STATUS.IN_PROGRESS; // send back for rework
//       task.reworkCount = (task.reworkCount || 0) + 1; // optional
//     }

//     await task.save();

//     //  points calculation
//     let points10;

//     if (decision === "APPROVED") {
//       points10 = calculateScore10({
//         deadline: task.deadline,
//         reworkCount: task.reworkCount || 0,
//         bugCount: task.bugCount || 0,
//         firstTimeApproval,
//         base: 8, // task base
//       });
//     } else {
//       points10 = -1 * (typeof deduction10 === "number" ? deduction10 : 2);
//     }

//     //  store rating 
//     const rating = await Rating.findOneAndUpdate(
//       { task: task._id, type: "TASK" },
//       {
//         employee: task.assignedTo?._id,
//         task: task._id,
//         module: task.module?._id || task.module,
//         type: "TASK",
//         decision,
//         points10,
//         reason,
//         createdBy: req.user?.id,
//         reviewedAt: new Date(),
//       },
//       { new: true, upsert: true }
//     );

//     return res.status(200).json({
//       message: decision === "APPROVED" ? "Task approved" : "Task rejected",
//       task,
//       rating,
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ message: "Task review failed" });
//   }
// };
