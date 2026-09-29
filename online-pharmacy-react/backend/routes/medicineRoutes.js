const express = require("express");
const Medicine = require("../models/Medicine");

const router = express.Router();

// ================= ADD MEDICINE =================

router.post("/", async (req, res) => {
    try {
        const { name, category, price, stock, description } = req.body;

        const medicine = new Medicine({
            name,
            category,
            price,
            stock,
            description
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


// ================= GET ALL MEDICINES =================

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


module.exports = router;