import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MJ_USER",
      required: true,
    },
    period: {
      type: String,
      required: true,
    },
    approvedCount: {
      type: Number,
      defayult: 0,
    },
    rejectedCount: {
      type: Number,
      default: 0,
    },
    lateSubmissions: {
      type: Number,
      default: 0,
    },
    score: {
      type: Number,
      default: 0,
    },
    generatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MJ_USER",
      //ADMIN //PROJECT MANAGER
    },
  },
  { timestamps: true },
);

export default mongoose.model("MJ_RATING",ratingSchema);