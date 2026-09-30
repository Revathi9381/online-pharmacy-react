const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
require("dotenv").config();

const mongoose = require("mongoose");
const Medicine = require("./models/Medicine");

const medicines = [
    {
        name: "Paracetamol",
        category: "Pain Relief",
        description: "Used for relief from pain and fever.",
        price: 25,
        stock: 100,
        icon: "💊"
    },
    {
        name: "Vitamin C",
        category: "Vitamins",
        description: "Vitamin supplement for everyday health.",
        price: 120,
        stock: 100,
        icon: "🍊"
    },
    {
        name: "Cough Syrup",
        category: "Cold & Cough",
        description: "Helps provide relief from cough symptoms.",
        price: 95,
        stock: 100,
        icon: "🧴"
    },
    {
        name: "Multivitamin",
        category: "Vitamins",
        description: "Daily nutritional vitamin supplement.",
        price: 180,
        stock: 100,
        icon: "💙"
    },
    {
        name: "Antacid",
        category: "Digestive Health",
        description: "For relief from acidity and indigestion.",
        price: 60,
        stock: 100,
        icon: "💊"
    },
    {
        name: "First Aid Cream",
        category: "First Aid",
        description: "Cream for minor cuts and skin irritation.",
        price: 85,
        stock: 100,
        icon: "🩹"
    },
    {
        name: "Ibuprofen",
        category: "Pain Relief",
        description: "Used for temporary relief from pain and inflammation.",
        price: 45,
        stock: 100,
        icon: "💊"
    },
    {
        name: "Cetirizine",
        category: "Allergy",
        description: "Helps relieve common allergy symptoms.",
        price: 35,
        stock: 100,
        icon: "💊"
    },
    {
        name: "Omeprazole",
        category: "Digestive Health",
        description: "Used to reduce excess stomach acid.",
        price: 70,
        stock: 100,
        icon: "💊"
    },
    {
        name: "ORS Sachet",
        category: "Hydration",
        description: "Helps replace fluids and electrolytes.",
        price: 20,
        stock: 100,
        icon: "🥤"
    },
    {
        name: "Amoxicillin",
        category: "Antibiotic",
        description: "Prescription antibiotic for certain bacterial infections.",
        price: 90,
        stock: 100,
        icon: "💊"
    },
    {
        name: "Azithromycin",
        category: "Antibiotic",
        description: "Prescription antibiotic for certain bacterial infections.",
        price: 85,
        stock: 100,
        icon: "💊"
    },
    {
        name: "Antiseptic Solution",
        category: "First Aid",
        description: "Used for cleaning minor cuts and wounds.",
        price: 75,
        stock: 100,
        icon: "🧴"
    },
    {
        name: "Pain Relief Balm",
        category: "Pain Relief",
        description: "Topical balm for temporary relief from minor discomfort.",
        price: 55,
        stock: 100,
        icon: "🧴"
    },
    {
        name: "Calcium Tablets",
        category: "Vitamins",
        description: "Calcium supplement for nutritional support.",
        price: 150,
        stock: 100,
        icon: "💊"
    },
    {
        name: "Iron Tablets",
        category: "Vitamins",
        description: "Iron supplement for nutritional support.",
        price: 110,
        stock: 100,
        icon: "💊"
    },
    {
        name: "Vitamin D3",
        category: "Vitamins",
        description: "Vitamin D supplement for everyday nutritional support.",
        price: 140,
        stock: 100,
        icon: "☀️"
    },
    {
        name: "Nasal Spray",
        category: "Cold & Allergy",
        description: "Helps provide temporary relief from nasal congestion.",
        price: 130,
        stock: 100,
        icon: "💧"
    },
    {
        name: "Eye Drops",
        category: "Eye Care",
        description: "Provides temporary relief from dry and irritated eyes.",
        price: 95,
        stock: 100,
        icon: "👁️"
    },
    {
        name: "Digital Thermometer",
        category: "Healthcare Devices",
        description: "Digital device for checking body temperature.",
        price: 199,
        stock: 100,
        icon: "🌡️"
    }
];

const seedMedicines = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB connected");

        await Medicine.deleteMany({});

        await Medicine.insertMany(medicines);

        console.log("20 medicines added successfully!");

        await mongoose.connection.close();

    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};

seedMedicines();