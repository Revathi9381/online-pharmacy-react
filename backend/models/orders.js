const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    // User who placed this order
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    medicineId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Medicine",
        required: true
    },

    medicineName: {
        type: String,
        required: true
    },

    price: {
        type: Number,
        required: true
    },

    quantity: {
        type: Number,
        default: 1
    },

    totalPrice: {
        type: Number,
        required: true
    },

    status: {
        type: String,
        default: "Pending"
    },

    orderDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Order", orderSchema);