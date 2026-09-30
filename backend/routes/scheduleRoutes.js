const express = require("express");
const mongoose = require("mongoose");
const Schedule = require("../models/Schedule");

const router = express.Router();

// ================= CREATE A NEW SCHEDULE =================
router.post("/", async (req, res) => {
    try {
        const {
            userId,
            medicine,
            time,
            frequency = "Once daily",
            status = "Upcoming"
        } = req.body;

        if (!userId || !medicine || !time) {
            return res.status(400).json({
                message: "User ID, medicine name and time are required"
            });
        }

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                message: "Invalid user ID"
            });
        }

        const newSchedule = new Schedule({
            userId,
            medicine,
            time,
            frequency,
            status
        });

        await newSchedule.save();

        res.status(201).json({
            message: "Schedule added successfully",
            schedule: newSchedule
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to add schedule",
            error: error.message
        });
    }
});

// ================= GET USER'S SCHEDULES =================
router.get("/", async (req, res) => {
    try {
        const { userId } = req.query;

        const filter = (userId && mongoose.Types.ObjectId.isValid(userId))
            ? { userId }
            : {};

        const schedules = await Schedule.find(filter)
            .sort({ time: 1, createdAt: -1 });

        res.status(200).json(schedules);

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch schedules",
            error: error.message
        });
    }
});

// ================= GET SINGLE USER SCHEDULE =================
router.get("/:id", async (req, res) => {
    try {
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({
                message: "User ID is required"
            });
        }

        const schedule = await Schedule.findOne({
            _id: req.params.id,
            userId
        });

        if (!schedule) {
            return res.status(404).json({
                message: "Schedule not found"
            });
        }

        res.status(200).json(schedule);

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch schedule",
            error: error.message
        });
    }
});

// ================= UPDATE USER SCHEDULE =================
router.put("/:id", async (req, res) => {
    try {
        const { userId, medicine, time, frequency, status } = req.body;

        if (!userId) {
            return res.status(400).json({
                message: "User ID is required"
            });
        }

        const updatedSchedule = await Schedule.findOneAndUpdate(
            {
                _id: req.params.id,
                userId
            },
            {
                medicine,
                time,
                frequency,
                status
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedSchedule) {
            return res.status(404).json({
                message: "Schedule not found"
            });
        }

        res.status(200).json({
            message: "Schedule updated successfully",
            schedule: updatedSchedule
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update schedule",
            error: error.message
        });
    }
});

// ================= DELETE USER SCHEDULE =================
router.delete("/:id", async (req, res) => {
    try {
        const { userId } = req.query;

        const filter = { _id: req.params.id };
        if (userId && mongoose.Types.ObjectId.isValid(userId)) {
            filter.userId = userId;
        }

        const deletedSchedule = await Schedule.findOneAndDelete(filter);

        if (!deletedSchedule) {
            return res.status(404).json({
                message: "Schedule not found"
            });
        }

        res.status(200).json({
            message: "Schedule deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to delete schedule",
            error: error.message
        });
    }
});

module.exports = router;