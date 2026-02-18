import mongoose from "mongoose";
import { MODULE_STATUS, REVIEW_STATUS } from "../utils/constants.js";

const moduleSchema = new mongoose.Schema(
    {
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

        status: {
            type: String,
            enum: Object.values(MODULE_STATUS),
            default: MODULE_STATUS.PENDING,
        },
        reviewStatus: {
            type: String,
            enum: Object.values(REVIEW_STATUS),
            default: REVIEW_STATUS.PENDING,
        },
        reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        reviewedAt: Date,

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

export default mongoose.model("IT_Module", moduleSchema);