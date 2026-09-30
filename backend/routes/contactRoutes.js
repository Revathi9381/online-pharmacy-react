const express = require("express");
const Contact = require("../models/Contact");

const router = express.Router();

// Email validation helper
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// ================= SUBMIT A CONTACT MESSAGE =================
router.post("/", async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        // Validation: Required fields
        if (!name || !email || !subject || !message) {
            return res.status(400).json({
                message: "Please provide Name, Email, Subject, and Message."
            });
        }

        // Validation: Email format
        if (!isValidEmail(email.trim())) {
            return res.status(400).json({
                message: "Please provide a valid email address."
            });
        }

        const newContact = new Contact({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            subject: subject.trim(),
            message: message.trim()
        });

        await newContact.save();

        res.status(201).json({
            message: "Your message has been sent successfully! Our support team will get back to you shortly.",
            contact: newContact
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to submit contact message",
            error: error.message
        });
    }
});

// ================= GET ALL CONTACT MESSAGES =================
router.get("/", async (req, res) => {
    try {
        const messages = await Contact.find().sort({ createdAt: -1 });

        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch contact messages",
            error: error.message
        });
    }
});

// ================= GET SINGLE CONTACT MESSAGE =================
router.get("/:id", async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);

        if (!contact) {
            return res.status(404).json({
                message: "Contact message not found"
            });
        }

        res.status(200).json(contact);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch contact message",
            error: error.message
        });
    }
});

// ================= DELETE CONTACT MESSAGE =================
router.delete("/:id", async (req, res) => {
    try {
        const deletedContact = await Contact.findByIdAndDelete(req.params.id);

        if (!deletedContact) {
            return res.status(404).json({
                message: "Contact message not found"
            });
        }

        res.status(200).json({
            message: "Contact message deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to delete contact message",
            error: error.message
        });
    }
});

module.exports = router;
