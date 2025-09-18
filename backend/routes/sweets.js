const express = require('express');
const Sweet = require('../models/Sweet');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { validateSweet } = require('../middleware/validation');

const router = express.Router();

// all routes below require auth
router.use(authenticateToken);

// create a new sweet
router.post('/', requireAdmin, validateSweet, async (req, res) => {
    try {
        const { name, price, quantity, description, imageUrl } = req.body;

        const existingSweet = await Sweet.findOne({ name });
        if (existingSweet) {
            return res.status(400).json({
                success: false,
                message: 'Sweet with this name already exists'
            });
        }

        const sweet = new Sweet({ name, price, quantity, description, imageUrl });

        await sweet.save();

        res.status(201).json({
            success: true,
            message: 'Sweet added successfully',
            data: sweet
        });
    } catch (error) {
        console.error('Add sweet error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while adding sweet'
        });
    }
});

// list sweets with pagination
router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 10, sortBy = 'name', sortOrder = 'asc' } = req.query;

        const filter = {};

        const sort = {};
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

        const sweets = await Sweet.find(filter)
            .sort(sort)
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Sweet.countDocuments(filter);

        res.json({
            success: true,
            data: {
                sweets,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(total / limit),
                    totalSweets: total,
                    hasNext: page < Math.ceil(total / limit),
                    hasPrev: page > 1
                }
            }
        });
    } catch (error) {
        console.error('Get sweets error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching sweets'
        });
    }
});

// search sweets by text and price range
router.get('/search', async (req, res) => {
    try {
        const { q, minPrice, maxPrice, page = 1, limit = 10 } = req.query;

        const filter = {};

        if (q) {
            filter.$text = { $search: q };
        }



        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = parseFloat(minPrice);
            if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
        }

        const sweets = await Sweet.find(filter)
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Sweet.countDocuments(filter);

        res.json({
            success: true,
            data: {
                sweets,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(total / limit),
                    totalSweets: total,
                    hasNext: page < Math.ceil(total / limit),
                    hasPrev: page > 1
                }
            }
        });
    } catch (error) {
        console.error('Search sweets error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while searching sweets'
        });
    }
});

// get single sweet by id
router.get('/:id', async (req, res) => {
    try {
        const sweet = await Sweet.findById(req.params.id);

        if (!sweet) {
            return res.status(404).json({
                success: false,
                message: 'Sweet not found'
            });
        }

        res.json({
            success: true,
            data: sweet
        });
    } catch (error) {
        console.error('Get sweet error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching sweet'
        });
    }
});

// update a sweet by id
router.put('/:id', requireAdmin, validateSweet, async (req, res) => {
    try {
        const { name, price, quantity, description, imageUrl } = req.body;

        const existingSweet = await Sweet.findById(req.params.id);
        if (!existingSweet) {
            return res.status(404).json({
                success: false,
                message: 'Sweet not found'
            });
        }

        if (name !== existingSweet.name) {
            const nameExists = await Sweet.findOne({ name, _id: { $ne: req.params.id } });
            if (nameExists) {
                return res.status(400).json({
                    success: false,
                    message: 'Sweet with this name already exists'
                });
            }
        }

        const updatedSweet = await Sweet.findByIdAndUpdate(
            req.params.id,
            { name, price, quantity, description, imageUrl },
            { new: true, runValidators: true }
        );

        res.json({
            success: true,
            message: 'Sweet updated successfully',
            data: updatedSweet
        });
    } catch (error) {
        console.error('Update sweet error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while updating sweet'
        });
    }
});

// delete a sweet by id
router.delete('/:id', requireAdmin, async (req, res) => {
    try {
        const sweet = await Sweet.findByIdAndDelete(req.params.id);

        if (!sweet) {
            return res.status(404).json({
                success: false,
                message: 'Sweet not found'
            });
        }

        res.json({
            success: true,
            message: 'Sweet deleted successfully'
        });
    } catch (error) {
        console.error('Delete sweet error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while deleting sweet'
        });
    }
});

module.exports = router;
