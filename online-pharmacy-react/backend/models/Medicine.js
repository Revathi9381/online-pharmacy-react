const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    category: {
        type: String,
        required: true
    },

    price: {
        type: Number,
        required: true
    },

    stock: {
        type: Number,
        required: true
    },

    description: {
        type: String
    }
});

module.exports = mongoose.model("Medicine", medicineSchema);