import mongoose from "mongoose";

const testerScoreSchema = new mongoose.Schema(
  {
    testerId: { type: mongoose.Schema.Types.ObjectId, ref: "IT_User" },
    testerName: { type: String, required: true },

    impact: { type: Number, default: 0 }, // + clean / - post completion bug
  },
  { timestamps: true }
);

export default mongoose.model("TesterScore", testerScoreSchema);