import mongoose from "mongoose";

const bugSchema = new mongoose.Schema(
  {
    testingProject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TestingProject",
      required: true,
    },

    projectName: { type: String, required: true },

    phase: {
      type: String,
      enum: ["frontend", "backend", "cyber", "seo"],
      required: true,
    },

    title: { type: String, required: true },
    description: { type: String, required: true },

    status: {
      type: String,
      enum: ["OPEN", "RETEST_REQUESTED", "RESOLVED"],
      default: "OPEN",
    },

    // rating rule:
    createdAfterPhaseComplete: { type: Boolean, default: false },

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "IT_User" },
  },
  { timestamps: true }
);

export default mongoose.model("Bug", bugSchema);