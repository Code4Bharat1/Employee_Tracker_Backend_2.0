import mongoose from "mongoose";
import { calcProgress, isFrozen } from "../utils/testingProgress.util.js";

const phaseSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ["pending", "completed", "bug_found"],
      default: "pending",
    },
    validated: { type: Boolean, default: false },
    completedAt: { type: Date },
    completedBy: { type: mongoose.Schema.Types.ObjectId, ref: "IT_User" },
  },
  { _id: false }
);

const testingProjectSchema = new mongoose.Schema(
  {
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
    name: { type: String, required: true },
    manager: { type: String, default: "" },

    phases: {
      frontend: { type: phaseSchema, default: () => ({}) },
      backend: { type: phaseSchema, default: () => ({}) },
      cyber: { type: phaseSchema, default: () => ({}) },
      seo: { type: phaseSchema, default: () => ({}) },
    },

    progress: { type: Number, default: 0 }, // auto
    frozen: { type: Boolean, default: false }, // auto
  },
  { timestamps: true }
);

// auto update progress/frozen before save
testingProjectSchema.pre("save", function (next) {
  this.progress = calcProgress(this.phases);
  this.frozen = isFrozen(this.phases);
  next();
});

export default mongoose.model("TestingProject", testingProjectSchema);