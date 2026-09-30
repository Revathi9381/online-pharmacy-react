const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    medicine: {
        type: String,
        required: true
    },

    time: {
        type: String,
        required: true
    },

    frequency: {
        type: String,
        default: "Once daily"
    },

    status: {
        type: String,
        default: "Upcoming"
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Schedule", scheduleSchema);