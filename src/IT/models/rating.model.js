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
      required: true, // ✅ ADD
    },

    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "IT_Project",
      required: true, // ✅ ADD
    },

    type: {
      type: String,
      enum: ["MODULE"],
      required: true,
    },

    reviewStatus: { // ✅ RENAMED
      type: String,
      enum: ["APPROVED", "REJECTED"],
      required: true, // ✅ ADD
    },

    points10: {
      type: Number,
      min: 0,   // ✅ CHANGE (no negative)
      max: 10,
      required: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "IT_User",
      required: true, // ✅ ADD
    },

    skill: {
      type: String,
      enum: ["Delivery", "Quality", "Ownership", "Collaboration", "Learning"],
      required: true,
    },

    attempt: { // ✅ NEW (VERY USEFUL)
      type: Number,
      default: 1,
    },

    reviewedAt: {
      type: Date,
      default: Date.now, // ✅ AUTO SET
    },
  },
  { timestamps: true }
);

ratingSchema.index({ employee: 1 });
ratingSchema.index({ project: 1 });
ratingSchema.index({ module: 1 }); // ✅ ADD

export default mongoose.model("Rating", ratingSchema);