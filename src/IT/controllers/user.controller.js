import bcrypt from "bcryptjs";
import User from "../models/user.model.js";

export const createUser = async (req, res) => {
    try {
        const {name, email, password, role} = req.body;
        const exists = await User.findOne({email});

        if(!name || !email || !password) {
            return res.status(400).json({message: "All fields are required"});
        }

        if(exists) {
            return res.status(400).json({message: "User already Exists"});
        }

        const hashedPassword = bcrypt.hash(password, 10);
        const user = User.create({
            name: name,
            email: email,
            password: hashedPassword,
            role
        })

        return res.status(201).json({
            success: true,
            user,
            message: "User created successfully"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

export const getUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        
        return res.status(200).json({
            success: true,
            users
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");

        if(!user) {
            return res.status(404).json({message: "User not found"});
        }

        return res.status(200).json({
            success: true,
            user
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

export const updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new: true}
        )

        return res.status(200).json({
            success: true,
            user,
            message: "User updated successfully"
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Internal Server Error"});
    }
}

export const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if(!user) {
            return res.status(404).json({messaeg: "User not found"});
        }

        return res.status(200).json({
            success: true,
            message: "User deleted successfully"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Internal Server Error"});
    }
}