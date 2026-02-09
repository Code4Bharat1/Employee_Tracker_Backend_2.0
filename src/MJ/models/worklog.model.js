import mongoose from "mongoose";

const worklogSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MJ_User",
      required: true,
    },
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MJ_Task",
    },
    description: {
      type: String,
      required: true,
    },
    screenshot: {
      type: String,
    },
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },
    rejectionCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("MJ_Worklog", worklogSchema);
