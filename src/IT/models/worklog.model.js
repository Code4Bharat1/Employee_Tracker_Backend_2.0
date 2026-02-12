import mongoose from "mongoose";
import { WORKLOG_STATUS } from "../utils/constants.js";

const worklogSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "IT_USER",
      required: true,
    },

    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "IT_TASK",
      required: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    screenShot: {
      type: String,
    },

    status: {
      type: String,
      enum: Object.values(WORKLOG_STATUS),
      default: WORKLOG_STATUS.PENDING,
    },

    rejectionCount: {
      type: Number,
      default: 0,
    },

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "IT_User",
    },

    approvedAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

export default mongoose.model("IT_Worklog", worklogSchema);
