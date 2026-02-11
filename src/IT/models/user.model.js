import mongoose from "mongoose";
import { ROLES } from "../utils/constants.js";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: Object.values(ROLES), required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export default mongoose.model("IT_USER", userSchema);
