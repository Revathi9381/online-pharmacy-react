const mongoose = require("mongoose");

const caretakerSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    relation: {
        type: String,
        default: "Family Member",
        trim: true
    },
    email: {
        type: String,
        default: "",
        trim: true
    },
    isEmergencyContact: {
        type: Boolean,
        default: true
    },
    permissions: {
        viewSchedule: {
            type: Boolean,
            default: true
        },
        viewOrders: {
            type: Boolean,
            default: true
        },
        receiveAlerts: {
            type: Boolean,
            default: true
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Caretaker", caretakerSchema);
