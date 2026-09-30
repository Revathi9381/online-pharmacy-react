const express = require("express");
const mongoose = require("mongoose");
const Reminder = require("../models/Reminder");

const router = express.Router();

// ================= ADD A REMINDER =================
router.post("/", async (req, res) => {
    try {
        const {
            userId,
            medicineName,
            dosage,
            time,
            frequency,
            startDate,
            notes
        } = req.body;

        if (!userId || !medicineName || !dosage || !time || !frequency) {
            return res.status(400).json({
                message:
                    "User ID, medicine name, dosage, time, and frequency are required"
            });
        }

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                message: "Invalid user ID"
            });
        }

        const newReminder = new Reminder({
            userId,
            medicineName,
            dosage,
            time,
            frequency,
            startDate: startDate ? new Date(startDate) : new Date(),
            notes: notes || ""
        });

        await newReminder.save();

        res.status(201).json({
            message: "Reminder set successfully",
            reminder: newReminder
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to create reminder",
            error: error.message
        });
    }
});


// ================= GET USER REMINDERS =================
router.get("/", async (req, res) => {
    try {
        const { userId } = req.query;

        const filter = (userId && mongoose.Types.ObjectId.isValid(userId))
            ? { userId }
            : {};

        const reminders = await Reminder.find(filter).sort({
            time: 1,
            createdAt: -1
        });

        res.status(200).json(reminders);

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch reminders",
            error: error.message
        });
    }
});


// ================= GET SINGLE USER REMINDER =================
router.get("/:id", async (req, res) => {
    try {
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({
                message: "User ID is required"
            });
        }

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                message: "Invalid user ID"
            });
        }

        const reminder = await Reminder.findOne({
            _id: req.params.id,
            userId
        });

        if (!reminder) {
            return res.status(404).json({
                message: "Reminder not found"
            });
        }

        res.status(200).json(reminder);

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch reminder",
            error: error.message
        });
    }
});


// ================= UPDATE USER REMINDER =================
router.put("/:id", async (req, res) => {
    try {
        const {
            userId,
            medicineName,
            dosage,
            time,
            frequency,
            startDate,
            notes,
            status
        } = req.body;

        if (!userId) {
            return res.status(400).json({
                message: "User ID is required"
            });
        }

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                message: "Invalid user ID"
            });
        }

        const updateData = {};

        if (medicineName !== undefined)
            updateData.medicineName = medicineName;

        if (dosage !== undefined)
            updateData.dosage = dosage;

        if (time !== undefined)
            updateData.time = time;

        if (frequency !== undefined)
            updateData.frequency = frequency;

        if (startDate !== undefined)
            updateData.startDate = new Date(startDate);

        if (notes !== undefined)
            updateData.notes = notes;

        if (status !== undefined)
            updateData.status = status;

        const updatedReminder =
            await Reminder.findOneAndUpdate(
                {
                    _id: req.params.id,
                    userId
                },
                updateData,
                {
                    new: true,
                    runValidators: true
                }
            );

        if (!updatedReminder) {
            return res.status(404).json({
                message: "Reminder not found"
            });
        }

        res.status(200).json({
            message: "Reminder updated successfully",
            reminder: updatedReminder
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update reminder",
            error: error.message
        });
    }
});


// ================= DELETE USER REMINDER =================
router.delete("/:id", async (req, res) => {
    try {
        const { userId } = req.query;

        const filter = { _id: req.params.id };
        if (userId && mongoose.Types.ObjectId.isValid(userId)) {
            filter.userId = userId;
        }

        const deletedReminder =
            await Reminder.findOneAndDelete(filter);

        if (!deletedReminder) {
            return res.status(404).json({
                message: "Reminder not found"
            });
        }

        res.status(200).json({
            message: "Reminder deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to delete reminder",
            error: error.message
        });
    }
});


module.exports = router;