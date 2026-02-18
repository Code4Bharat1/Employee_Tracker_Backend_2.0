import mongoose from "mongoose";
import { TASK_STATUS } from "../utils/constants.js";
import { REVIEW_STATUS } from "../utils/constants.js";


const taskSchema = new mongoose.Schema({
    module: { type: mongoose.Schema.Types.ObjectId, ref: "IT_Module", required: true },
    title: {
        type: String,
        required: true
    },
    description: String,
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "IT_User"
    },
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
    deadline: Date,
    status: {
        type: String,
        enum: Object.values(TASK_STATUS),
        default: TASK_STATUS.PENDING,
    },
    reviewStatus: {
        type: String,
        enum: Object.values(REVIEW_STATUS),
        default: REVIEW_STATUS.PENDING,
    },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    reviewedAt: Date,
},
    { timestamps: true }
);

export default mongoose.model("IT_Task", taskSchema);