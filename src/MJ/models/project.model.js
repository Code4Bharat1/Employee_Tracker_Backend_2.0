import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    clientName: {
      type: String,
    },
    description: {
      type: String,
    },
    creadtedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MJ_User",
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["ACTIVE", "COMPLETED", "ON_HOLD"],
      default: "ACTIVE",
    },
  },
  { timestamps: true },
);

export default mongoose.model("MJ_PROJECT",projectSchema);
