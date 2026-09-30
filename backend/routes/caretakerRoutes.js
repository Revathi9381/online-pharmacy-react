const express = require("express");
const mongoose = require("mongoose");
const Caretaker = require("../models/Caretaker");

const router = express.Router();

// ================= ADD A CARETAKER =================
router.post("/", async (req, res) => {
    try {
        const { name, phone, relation, email, isEmergencyContact, permissions, userId } = req.body;

        if (!name || !phone) {
            return res.status(400).json({
                message: "Caretaker name and phone number are required"
            });
        }

        const validUserId = (userId && mongoose.Types.ObjectId.isValid(userId)) ? userId : undefined;

        const newCaretaker = new Caretaker({
            userId: validUserId,
            name,
            phone,
            relation: relation || "Family Member",
            email: email || "",
            isEmergencyContact: isEmergencyContact !== undefined ? isEmergencyContact : true,
            permissions: {
                viewSchedule: permissions?.viewSchedule !== undefined ? permissions.viewSchedule : true,
                viewOrders: permissions?.viewOrders !== undefined ? permissions.viewOrders : true,
                receiveAlerts: permissions?.receiveAlerts !== undefined ? permissions.receiveAlerts : true
            }
        });

        await newCaretaker.save();

        res.status(201).json({
            message: "Caretaker added successfully",
            caretaker: newCaretaker
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to add caretaker",
            error: error.message
        });
    }
});

// ================= GET ALL CARETAKERS =================
router.get("/", async (req, res) => {
    try {
        const { userId } = req.query;
        const filter = (userId && mongoose.Types.ObjectId.isValid(userId))
            ? { $or: [{ userId }, { userId: { $exists: false } }, { userId: null }] }
            : {};

        const caretakers = await Caretaker.find(filter).sort({ createdAt: -1 });

        res.status(200).json(caretakers);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch caretakers",
            error: error.message
        });
    }
});

// ================= GET SINGLE CARETAKER =================
router.get("/:id", async (req, res) => {
    try {
        const caretaker = await Caretaker.findById(req.params.id);

        if (!caretaker) {
            return res.status(404).json({
                message: "Caretaker not found"
            });
        }

        res.status(200).json(caretaker);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch caretaker",
            error: error.message
        });
    }
});

// ================= UPDATE CARETAKER =================
router.put("/:id", async (req, res) => {
    try {
        const { name, phone, relation, email, isEmergencyContact, permissions } = req.body;

        const updateData = {};
        if (name !== undefined) updateData.name = name;
        if (phone !== undefined) updateData.phone = phone;
        if (relation !== undefined) updateData.relation = relation;
        if (email !== undefined) updateData.email = email;
        if (isEmergencyContact !== undefined) updateData.isEmergencyContact = isEmergencyContact;
        if (permissions !== undefined) updateData.permissions = permissions;

        const updatedCaretaker = await Caretaker.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedCaretaker) {
            return res.status(404).json({
                message: "Caretaker not found"
            });
        }

        res.status(200).json({
            message: "Caretaker updated successfully",
            caretaker: updatedCaretaker
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to update caretaker",
            error: error.message
        });
    }
});

// ================= DELETE CARETAKER =================
router.delete("/:id", async (req, res) => {
    try {
        const deletedCaretaker = await Caretaker.findByIdAndDelete(req.params.id);

        if (!deletedCaretaker) {
            return res.status(404).json({
                message: "Caretaker not found"
            });
        }

        res.status(200).json({
            message: "Caretaker deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to delete caretaker",
            error: error.message
        });
    }
});

module.exports = router;
