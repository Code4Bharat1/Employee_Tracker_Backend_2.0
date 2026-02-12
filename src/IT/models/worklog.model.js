import mongoose from "mongoose";

const worklogSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "IT_User",
      required: true,
    },

    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "IT_Task",
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
  },
  { timestamps: true }
);

export default mongoose.model("IT_Worklog", worklogSchema);
