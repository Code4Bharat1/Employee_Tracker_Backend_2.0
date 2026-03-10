import mongoose from "mongoose";
import { MODULE_STATUS, REVIEW_STATUS } from "../utils/constants.js";

const moduleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },

    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "IT_Project",
        required: true,
    },

    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "IT_User",
    },

    deadline: {
        type: Date
    },

    progress: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
    },

    priority: {                          // ✅ ADD THIS FIELD
        type: String,
        enum: ['LOW', 'MEDIUM', 'HIGH'],
        default: 'MEDIUM'
    },

    status: {
        type: String,
        enum: Object.values(MODULE_STATUS),
        default: MODULE_STATUS.PENDING,
    },
}, { timestamps: true });

export default mongoose.model("IT_Module", moduleSchema);