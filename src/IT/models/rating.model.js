import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema(
  {
    employee: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    task: { type: mongoose.Schema.Types.ObjectId, ref: "Task" },
    module: { type: mongoose.Schema.Types.ObjectId, ref: "Module" },
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },

    type: {
      type: String,
      enum: ["TASK", "MODULE"],
      required: true,
    },

    decision: {
      type: String,
      enum: ["APPROVED", "REJECTED"],
    },

    points10: { type: Number, min: -10, max: 10 }, // + or -

    reason: String,

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    reviewedAt: Date,
  },
  { timestamps: true }
);

export default mongoose.model("Rating", ratingSchema);
