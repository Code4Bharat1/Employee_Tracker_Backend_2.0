import mongoose from "mongoose";

const moduleSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MJ_Project",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
    },
    assignedDepartment: {
      type: String,
    },
    status: {
      type: String,
      enum: ["PENDING", "IN_PROGRESS", "COMPLETED"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

export default mongoose.model("MJ_Module", moduleSchema);
