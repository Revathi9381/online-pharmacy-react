const express = require("express");
const mongoose = require("mongoose");
const Order = require("../models/orders");

const router = express.Router();

// =====================================================
// GET ORDER HISTORY
// =====================================================
// Default: Completed and Cancelled orders
// ?status=Completed
// ?status=Cancelled
// ?status=all
// Always filtered by logged-in user
// =====================================================

router.get("/", async (req, res) => {
    try {
        const { userId, status } = req.query;

        // Base filter
        let filter = {};
        if (userId && mongoose.Types.ObjectId.isValid(userId)) {
            filter.userId = userId;
        }

        // Status filter
        if (status === "all") {
            // All orders (no status filter)
        } else if (status) {
            // Specific status
            filter.status = status;
        } else {
            // Default history
            filter.status = {
                $in: ["Completed", "Cancelled"]
            };
        }

        const historyOrders = await Order.find(filter)
            .sort({ orderDate: -1 })
            .populate("medicineId");

        res.status(200).json(historyOrders);

    } catch (error) {

        console.error(
            "History fetch error:",
            error
        );

        res.status(500).json({
            message: "Failed to fetch order history",
            error: error.message
        });
    }
});


// =====================================================
// UPDATE ORDER STATUS
// =====================================================
// Used when an order becomes Completed / Cancelled
// =====================================================

router.put("/:id/status", async (req, res) => {
    try {

        const { status, userId } = req.body;

        // Check userId
        if (!userId) {
            return res.status(400).json({
                message: "User ID is required"
            });
        }

        // Validate userId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                message: "Invalid user ID"
            });
        }

        // Check status
        if (!status) {
            return res.status(400).json({
                message: "Status is required"
            });
        }

        const updatedOrder =
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
            ).populate("medicineId");

        if (!updatedOrder) {
            return res.status(404).json({
                message:
                    "Order not found for this user"
            });
        }

        res.status(200).json({
            message:
                `Order status updated to ${status}`,
            order: updatedOrder
        });

    } catch (error) {

        console.error(
            "Order status update error:",
            error
        );

        res.status(500).json({
            message:
                "Failed to update order status",
            error: error.message
        });
    }
});


// =====================================================
// CLEAR COMPLETED & CANCELLED HISTORY
// =====================================================

router.delete("/", async (req, res) => {
    try {

        const { userId } = req.query;

        // Check userId
        if (!userId) {
            return res.status(400).json({
                message: "User ID is required"
            });
        }

        // Validate userId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                message: "Invalid user ID"
            });
        }

        const result =
            await Order.deleteMany({
                userId,
                status: {
                    $in: [
                        "Completed",
                        "Cancelled"
                    ]
                }
            });

        res.status(200).json({
            message:
                "Completed and cancelled history cleared successfully",
            deletedCount:
                result.deletedCount
        });

    } catch (error) {

        console.error(
            "Clear history error:",
            error
        );

        res.status(500).json({
            message: "Failed to clear history",
            error: error.message
        });
    }
});


// =====================================================
// DELETE SINGLE HISTORY ENTRY
// =====================================================

router.delete("/:id", async (req, res) => {
    try {

        const { userId } = req.query;

        // Check userId
        if (!userId) {
            return res.status(400).json({
                message: "User ID is required"
            });
        }

        // Validate userId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                message: "Invalid user ID"
            });
        }

        const deletedOrder =
            await Order.findOneAndDelete({
                _id: req.params.id,
                userId
            });

        if (!deletedOrder) {
            return res.status(404).json({
                message:
                    "History entry not found"
            });
        }

        res.status(200).json({
            message:
                "History entry removed successfully"
        });

    } catch (error) {

        console.error(
            "Delete history error:",
            error
        );

        res.status(500).json({
            message:
                "Failed to remove history entry",
            error: error.message
        });
    }
});


module.exports = router;