const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/User");

const router = express.Router();


// ================= REGISTER =================

router.post("/register", async (req, res) => {
    try {
        if (mongoose.connection.readyState < 1) {
            return res.status(503).json({
                message: "Database service unavailable. Please check MongoDB connection."
            });
        }

        const {
            fullName,
            email,
            phone,
            dob,
            gender,
            password
        } = req.body;

        // Check required fields
        if (!fullName || !email || !phone || !dob || !gender || !password) {
            return res.status(400).json({
                message: "Please fill all required fields"
            });
        }

        // Clean email
        const cleanEmail = email.trim().toLowerCase();

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(cleanEmail)) {
            return res.status(400).json({
                message: "Please enter a valid email address"
            });
        }

        // Check if email already exists
        const existingUser = await User.findOne({
            email: cleanEmail
        });

        if (existingUser) {
            return res.status(400).json({
                message: "Email already registered"
            });
        }

        // Validate phone number
        const cleanPhone = phone.trim();

        const phoneRegex = /^[0-9]{10}$/;

        if (!phoneRegex.test(cleanPhone)) {
            return res.status(400).json({
                message: "Please enter a valid 10-digit phone number"
            });
        }

        // Validate password length
        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters long"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            fullName: fullName.trim(),
            email: cleanEmail,
            phone: cleanPhone,
            dob,
            gender,
            password: hashedPassword
        });

        // Save user to MongoDB
        await newUser.save();

        res.status(201).json({
            message: "Registration successful"
        });

    } catch (error) {
        console.error("REGISTER ERROR:", error);

        res.status(500).json({
            message: "Registration failed",
            error: error.message
        });
    }
});


// ================= LOGIN =================

router.post("/login", async (req, res) => {
    try {
        if (mongoose.connection.readyState < 1) {
            return res.status(503).json({
                message: "Database service unavailable. Please check MongoDB connection."
            });
        }

        const { email, password } = req.body;

        // Check required fields
        if (!email || !password) {
            return res.status(400).json({
                message: "Please enter email and password"
            });
        }

        // Clean email
        const cleanEmail = email.trim().toLowerCase();

        console.log("LOGIN EMAIL:", cleanEmail);

        // Find user by email
        const user = await User.findOne({
            email: cleanEmail
        });

        if (!user) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }

        // Compare entered password with hashed password
        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }

        // Generate JWT token if secret is configured
        const jwtSecret = process.env.JWT_SECRET || "online_pharmacy_jwt_secret";
        const token = jwt.sign(
            { id: user._id, email: user.email },
            jwtSecret,
            { expiresIn: "7d" }
        );

        // Login successful
        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                phone: user.phone,
                dob: user.dob,
                gender: user.gender
            }
        });

    } catch (error) {
        console.error("LOGIN ERROR:", error);

        res.status(500).json({
            message: "Login failed",
            error: error.message
        });
    }
});


// ================= UPDATE PASSWORD =================

router.put("/update-password", async (req, res) => {
    try {
        if (mongoose.connection.readyState < 1) {
            return res.status(503).json({
                message: "Database service unavailable. Please check MongoDB connection."
            });
        }

        const { email, newPassword } = req.body;

        // Check required fields
        if (!email || !newPassword) {
            return res.status(400).json({
                message: "Email and new password are required"
            });
        }

        // Clean email
        const cleanEmail = email.trim().toLowerCase();

        // Find user by email
        const user = await User.findOne({
            email: cleanEmail
        });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Validate new password
        if (newPassword.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters long"
            });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(
            newPassword,
            10
        );

        // Update password
        user.password = hashedPassword;

        // Save updated user
        await user.save();

        res.status(200).json({
            message: "Password updated successfully"
        });

    } catch (error) {
        console.error("UPDATE PASSWORD ERROR:", error);

        res.status(500).json({
            message: "Password update failed",
            error: error.message
        });
    }
});


module.exports = router;