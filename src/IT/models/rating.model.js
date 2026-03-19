import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "IT_User",
      required: true,
    },

    module: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "IT_Module",
    },

    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "IT_Project",
    },

    type: {
      type: String,
      enum: ["MODULE"],
      required: true,
    },

    decision: {
      type: String,
      enum: ["APPROVED", "REJECTED"],
    },

    points10: {
      type: Number,
      min: -10,
      max: 10,
    },

    reason: String,

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "IT_User",
    },

    skill: {
      type: String,
      enum: ["Delivery", "Quality", "Ownership", "Collaboration", "Learning"],
      required: true,
    },

    reviewedAt: Date,
  },
  { timestamps: true },
);

ratingSchema.index({ employee: 1 });
ratingSchema.index({ project: 1 });

export default mongoose.model("Rating", ratingSchema);
