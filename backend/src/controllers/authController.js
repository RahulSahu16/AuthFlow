import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateAccessToken, generateRefreshToken } from "../utils/generateToken.js";

export const registerUser = async (req,res) => {
    try {
        const { firstname, lastname, email, password } = req.body;

        if(!firstname || !lastname || !email || !password){
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });
        if(existingUser){
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            firstname,
            lastname,
            email,
            password: hashedPassword,
        });
        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });
    } 
    catch (error){
        res.status(500).json({ message: error.message });
    }
}

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        const hashedToken = await bcrypt.hash(refreshToken, 10);
        user.refreshToken = hashedToken;
        await user.save();

        res.status(200).json({
            message: "Login successful",
            accessToken,
            refreshToken
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};