const express = require('express');
const Sweet = require('../models/Sweet');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { validateInventoryOperation } = require('../middleware/validation');

const router = express.Router();

// all routes below require auth
router.use(authenticateToken);

// purchase an item (decrement stock)
router.post('/:id/purchase', validateInventoryOperation, async (req, res) => {
    try {
        const { quantity } = req.body;
        const sweetId = req.params.id;

        const sweet = await Sweet.findById(sweetId);
        if (!sweet) {
            return res.status(404).json({
                success: false,
                message: 'Sweet not found'
            });
        }

        if (sweet.quantity < quantity) {
            return res.status(400).json({
                success: false,
                message: `Insufficient stock. Available quantity: ${sweet.quantity}`
            });
        }

        const updatedSweet = await Sweet.findByIdAndUpdate(
            sweetId,
            { $inc: { quantity: -quantity } },
            { new: true }
        );

        res.json({
            success: true,
            message: `Successfully purchased ${quantity} ${sweet.name}(s)`,
            data: {
                sweet: updatedSweet,
                purchasedQuantity: quantity,
                remainingQuantity: updatedSweet.quantity
            }
        });
    } catch (error) {
        console.error('Purchase error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during purchase'
        });
    }
});

// restock an item (admin only)
router.post('/:id/restock', requireAdmin, validateInventoryOperation, async (req, res) => {
    try {
        const { quantity } = req.body;
        const sweetId = req.params.id;

        const sweet = await Sweet.findById(sweetId);
        if (!sweet) {
            return res.status(404).json({
                success: false,
                message: 'Sweet not found'
            });
        }

        const updatedSweet = await Sweet.findByIdAndUpdate(
            sweetId,
            { $inc: { quantity: quantity } },
            { new: true }
        );

        res.json({
            success: true,
            message: `Successfully restocked ${quantity} ${sweet.name}(s)`,
            data: {
                sweet: updatedSweet,
                restockedQuantity: quantity,
                newTotalQuantity: updatedSweet.quantity
            }
        });
    } catch (error) {
        console.error('Restock error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during restock'
        });
    }
});

// get current stock for a sweet
router.get('/:id/stock', async (req, res) => {
    try {
        const sweet = await Sweet.findById(req.params.id).select('name quantity');

        if (!sweet) {
            return res.status(404).json({
                success: false,
                message: 'Sweet not found'
            });
        }

        res.json({
            success: true,
            data: {
                sweetId: sweet._id,
                name: sweet.name,
                currentStock: sweet.quantity,
                isAvailable: sweet.quantity > 0,
                status: sweet.quantity > 0 ? 'In Stock' : 'Out of Stock'
            }
        });
    } catch (error) {
        console.error('Get stock error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching stock'
        });
    }
});

// list items under threshold (admin)
router.get('/low-stock', requireAdmin, async (req, res) => {
    try {
        const { threshold = 10 } = req.query;

        const lowStockSweets = await Sweet.find({
            quantity: { $lte: parseInt(threshold) }
        }).select('name category quantity price');

        res.json({
            success: true,
            data: {
                sweets: lowStockSweets,
                threshold: parseInt(threshold),
                count: lowStockSweets.length
            }
        });
    } catch (error) {
        console.error('Get low stock error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching low stock items'
        });
    }
});

module.exports = router;
