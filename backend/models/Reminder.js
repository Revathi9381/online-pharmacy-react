const mongoose = require("mongoose");

const reminderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    medicineName: {
        type: String,
        required: true
    },

    dosage: {
        type: String,
        required: true
    },

    time: {
        type: String,
        required: true
    },

    frequency: {
        type: String,
        required: true,
        default: "Once Daily"
    },

    startDate: {
        type: Date,
        required: true,
        default: Date.now
    },

    notes: {
        type: String,
        default: ""
    },

    status: {
        type: String,
        default: "Active"
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Reminder", reminderSchema);