// import mongoose from "mongoose";
// import { TASK_STATUS, REVIEW_STATUS } from "../utils/constants.js";

// const taskSchema = new mongoose.Schema(
//   {
//     module: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "IT_Module",
//       required: true,
//     },
//     title: { type: String, required: true },
//     description: String,
//     assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "IT_User" },

//     deadline: Date,

//     status: {
//       type: String,
//       enum: Object.values(TASK_STATUS),
//       default: TASK_STATUS.PENDING,
//     },

//     reviewStatus: {
//       type: String,
//       enum: Object.values(REVIEW_STATUS),
//       default: REVIEW_STATUS.PENDING,
//     },

//     //  FIX: correct ref (your user model is IT_User)
//     reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "IT_User" },
//     reviewedAt: Date,

//     //  OPTIONAL (needed if you want scoring based on rework/bugs)
//     reworkCount: { type: Number, default: 0 },
//     bugCount: { type: Number, default: 0 },
//   },
//   { timestamps: true }
// );

// export default mongoose.model("IT_Task", taskSchema);
