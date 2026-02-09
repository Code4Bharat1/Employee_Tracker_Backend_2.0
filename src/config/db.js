import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connection Success");
  } catch (error) {
    console.log(error)
    console.log("MongoDB Connection ERROR");
    process.exit(1);
  }
};

export default connectDB;
