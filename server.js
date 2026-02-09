import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./src/config/db.js";

dotenv.config();

connectDB()

const app = express();

app.use(cors({
    origin:"http://localhost:3000",
    credentials:true
}));

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res)=>{
    res.json("MJ Phase-1 Backend Running")
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`🚀 MJ server running on port ${PORT}`);
});