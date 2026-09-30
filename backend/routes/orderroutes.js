const express = require("express");
const mongoose = require("mongoose");
const Order = require("../models/orders");

const router = express.Router();

// ================= CREATE ORDER =================

router.post("/", async (req, res) => {
    try {

        // ---------- ARRAY OF ORDERS ----------
        if (Array.isArray(req.body)) {

            const userId = req.query.userId || (req.body[0] && req.body[0].userId);

            if (!userId) {
                return res.status(400).json({
                    message: "User ID is required"
                });
            }

            if (!mongoose.Types.ObjectId.isValid(userId)) {
                return res.status(400).json({
                    message: "Invalid user ID"
                });
            }

            const ordersToInsert = req.body.map((item) => {

                const quantity = Number(item.quantity) || 1;
                const price = Number(item.price) || 0;

                return {
                    userId,
                    medicineId: item.medicineId || item._id,
                    medicineName: item.medicineName || item.name,
                    price,
                    quantity,
                    totalPrice:
                        Number(item.totalPrice) ||
                        price * quantity
                };
            });

            const orders = await Order.insertMany(
                ordersToInsert
            );

            return res.status(201).json({
                message: "Order placed successfully",
                orders
            });
        }

        // ---------- SINGLE ORDER ----------

        const {
            userId: bodyUserId,
            medicineId,
            medicineName,
            price,
            quantity = 1,
            _id,
            name
        } = req.body;

        const userId = bodyUserId || req.query.userId;

        if (!userId) {
            return res.status(400).json({
                message: "User ID is required"
            });
        }

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                message: "Invalid user ID"
            });
        }

        const resolvedMedicineId =
            medicineId || _id;

        const resolvedMedicineName =
            medicineName || name;

        const resolvedPrice =
            Number(price) || 0;

        const resolvedQuantity =
            Number(quantity) || 1;

        const totalPrice =
            resolvedPrice * resolvedQuantity;

        const order = new Order({
            userId,
            medicineId: resolvedMedicineId,
            medicineName: resolvedMedicineName,
            price: resolvedPrice,
            quantity: resolvedQuantity,
            totalPrice
        });

        await order.save();

        res.status(201).json({
            message: "Order placed successfully",
            order
        });

    } catch (error) {

        res.status(500).json({
            message: "Failed to place order",
            error: error.message
        });

    }
});


// ================= GET USER ORDERS =================

router.get("/", async (req, res) => {

    try {

        const { userId, status } = req.query;

        const filter = {};

        if (userId && mongoose.Types.ObjectId.isValid(userId)) {
            filter.userId = userId;
        }

        // Status filtering
        if (status) {

            if (status.includes(",")) {

                filter.status = {
                    $in: status.split(",")
                };

            } else {

                filter.status = status;

            }
        }

        const orders = await Order.find(filter)
            .sort({ orderDate: -1 })
            .populate("medicineId");

        res.status(200).json(orders);

    } catch (error) {

        res.status(500).json({
            message: "Failed to fetch orders",
            error: error.message
        });

    }
});


// ================= GET ONE USER ORDER =================

router.get("/:id", async (req, res) => {

    try {

        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({
                message: "User ID is required"
            });
        }

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                message: "Invalid user ID"
            });
        }

        const order = await Order.findOne({
            _id: req.params.id,
            userId
        }).populate("medicineId");

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        res.status(200).json(order);

    } catch (error) {

        res.status(500).json({
            message: "Failed to fetch order",
            error: error.message
        });

    }
});


// ================= UPDATE USER ORDER =================

router.put("/:id", async (req, res) => {

    try {

        const { userId, status } = req.body;

        if (!userId) {
            return res.status(400).json({
                message: "User ID is required"
            });
        }

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                message: "Invalid user ID"
            });
        }

        const order =
            await Order.findOneAndUpdate(
                {
                    _id: req.params.id,
                    userId
                },
                {
                    status
                },
                {
                    new: true,
                    runValidators: true
                }
            );

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        res.status(200).json({
            message: "Order updated successfully",
            order
        });

    } catch (error) {

        res.status(500).json({
            message: "Failed to update order",
            error: error.message
        });

    }
});


// ================= DELETE USER ORDER =================

router.delete("/:id", async (req, res) => {

    try {

        const { userId } = req.query;

        const filter = { _id: req.params.id };

        if (userId && mongoose.Types.ObjectId.isValid(userId)) {
            filter.userId = userId;
        }

        const order =
            await Order.findOneAndDelete(filter);

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        res.status(200).json({
            message: "Order deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: "Failed to delete order",
            error: error.message
        });

    }
});


module.exports = router;