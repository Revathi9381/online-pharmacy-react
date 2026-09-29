const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");

const router = express.Router();


// ================= REGISTER =================

router.post("/register", async (req, res) => {
    try {

        const {
            fullName,
            email,
            phone,
            dob,
            gender,
            password
        } = req.body;


        // Check if email already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "Email already registered"
            });
        }


        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);


        // Create new user
        const newUser = new User({
            fullName,
            email,
            phone,
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

        res.status(500).json({
            message: "Registration failed",
            error: error.message
        });

    }
});



// ================= LOGIN =================

router.post("/login", async (req, res) => {
    try {

        const { email, password } = req.body;


        // Find user by email
        const user = await User.findOne({ email });

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


        // Login successful
        res.status(200).json({
            message: "Login successful",

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

        res.status(500).json({
            message: "Login failed",
            error: error.message
        });

    }
});


module.exports = router;