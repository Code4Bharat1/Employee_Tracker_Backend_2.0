import bcrypt, { hash } from "bcryptjs";
import User from "../models/user.model.js";

//Create User
export const createUser = async (req, res) => {
  try {
    const { name, email, password, role, department } = req.body;

    const exists = await User.findOne({ email });

    if (exists) {
      return res.status(400).json({ message: "User Already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
      role,
      department,
    });

    return res.status(201).json({ message: "User Created", user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

//Updated User
export const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).select("-password");
    return res.status(200).json({ message: "User Updated", user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

//Delete User
export const deleteUser = async (req, res) => {
  try {
    await User.findOneAndDelete(req.params.id);
    return res.status(200).json({ message: "User Deleted" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server error" });
  }
};
