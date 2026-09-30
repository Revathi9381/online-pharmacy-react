const express = require("express");
const Medicine = require("../models/Medicine");

const router = express.Router();

// Add a new medicine
router.post("/", async (req, res) => {
    try {
        const {
            name,
            category,
            price,
            stock,
            description,
            icon
        } = req.body;

        const medicine = new Medicine({
            name,
            category,
            price,
            stock,
            description,
            icon
        });

        await medicine.save();

        res.status(201).json({
            message: "Medicine added successfully",
            medicine
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to add medicine",
            error: error.message
        });
    }
});


// Get all medicines
router.get("/", async (req, res) => {
    try {
        const medicines = await Medicine.find();

        res.status(200).json(medicines);

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch medicines",
            error: error.message
        });
    }
});


// Get one medicine by ID
router.get("/:id", async (req, res) => {
    try {
        const medicine = await Medicine.findById(req.params.id);

        if (!medicine) {
            return res.status(404).json({
                message: "Medicine not found"
            });
        }

        res.status(200).json(medicine);

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch medicine",
            error: error.message
        });
    }
});


// Update a medicine
router.put("/:id", async (req, res) => {
    try {
        const medicine = await Medicine.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!medicine) {
            return res.status(404).json({
                message: "Medicine not found"
            });
        }

        res.status(200).json({
            message: "Medicine updated successfully",
            medicine
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update medicine",
            error: error.message
        });
    }
});


// Delete a medicine
router.delete("/:id", async (req, res) => {
    try {
        const medicine = await Medicine.findByIdAndDelete(req.params.id);

        if (!medicine) {
            return res.status(404).json({
                message: "Medicine not found"
            });
        }

        res.status(200).json({
            message: "Medicine deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to delete medicine",
            error: error.message
        });
    }
});


module.exports = router;