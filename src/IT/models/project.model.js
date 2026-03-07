import mongoose from "mongoose";
import { PROJECT_STATUS } from "../utils/constants.js";
import { PRIORITY } from "../utils/constants.js";

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "IT_User" },
    status: {
      type: String,
      enum: Object.values(PROJECT_STATUS),
      default: PROJECT_STATUS.TESTING_COMPLETED,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "IT_User",
      required: true
    },
    startDate: {
      type: Date
    },
    deadline: {
      type: Date
    },
    priority: {
      type: String,
      enum: Object.values(PRIORITY),
      default: PRIORITY.LOW
    }
  },
  { timestamps: true }
);

export default mongoose.model("IT_Project", projectSchema);
