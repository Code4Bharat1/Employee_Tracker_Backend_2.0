import mongoose from "mongoose";
import { PROJECT_STATUS } from "../utils/constants.js";

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "IT_User" },
    status: {
      type: String,
      enum: Object.values(PROJECT_STATUS),
      default: PROJECT_STATUS.ACTIVE,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "IT_User",
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("IT_Project", projectSchema);
