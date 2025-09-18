const express = require('express');
const Cart = require('../models/Cart');
const Sweet = require('../models/Sweet');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// all cart routes require auth
router.use(authenticateToken);

// fetch or create a user's cart
const getCart = async (userId) => {
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
        cart = await Cart.create({ user: userId, items: [] });
    }
    return cart;
};

// get current cart
router.get('/', async (req, res) => {
    try {
        const cart = await getCart(req.user._id);
        res.json({ success: true, data: { cart, total: cart.getTotal() } });
    } catch (error) {
        console.error('Get cart error:', error);
        res.status(500).json({ success: false, message: 'Failed to get cart' });
    }
});

// add item to cart (reserves stock)
router.post('/add', async (req, res) => {
    try {
        const { sweetId, quantity = 1 } = req.body;
        if (!sweetId || quantity < 1) {
            return res.status(400).json({ success: false, message: 'Invalid payload' });
        }

        const sweet = await Sweet.findById(sweetId);
        if (!sweet) return res.status(404).json({ success: false, message: 'Sweet not found' });

        const cart = await getCart(req.user._id);
        const existing = cart.items.find((it) => String(it.sweet) === String(sweet._id));

        const currentQty = existing ? existing.quantity : 0;
        const requestedQty = Math.min(5 - currentQty, quantity);
        if (requestedQty <= 0) {
            return res.status(400).json({ success: false, message: 'Limit reached (max 5 per item)' });
        }

        if (sweet.quantity < requestedQty) {
            return res.status(400).json({ success: false, message: `Only ${sweet.quantity} left in stock` });
        }

        sweet.quantity -= requestedQty;
        await sweet.save();

        if (existing) {
            existing.quantity += requestedQty;
        } else {
            cart.items.push({
                sweet: sweet._id,
                name: sweet.name,
                price: sweet.price,
                quantity: requestedQty,
                imageUrl: sweet.imageUrl
            });
        }

        await cart.save();
        res.json({ success: true, message: 'Added to cart', data: { cart, total: cart.getTotal() } });
    } catch (error) {
        console.error('Add to cart error:', error);
        res.status(500).json({ success: false, message: 'Failed to add to cart' });
    }
});

// update item quantity in cart
router.post('/update', async (req, res) => {
    try {
        const { sweetId, quantity } = req.body;
        if (!sweetId || quantity < 0 || quantity > 5) {
            return res.status(400).json({ success: false, message: 'Invalid quantity' });
        }

        const cart = await getCart(req.user._id);
        const item = cart.items.find((it) => String(it.sweet) === String(sweetId));
        if (!item) return res.status(404).json({ success: false, message: 'Item not in cart' });

        const sweet = await Sweet.findById(sweetId);
        if (!sweet) return res.status(404).json({ success: false, message: 'Sweet not found' });

        const delta = quantity - item.quantity;
        if (delta > 0) {
            if (sweet.quantity < delta) {
                return res.status(400).json({ success: false, message: `Only ${sweet.quantity} more available` });
            }
            sweet.quantity -= delta;
            item.quantity = quantity;
        } else if (delta < 0) {
            sweet.quantity += Math.abs(delta);
            item.quantity = quantity;
        }

        if (item.quantity === 0) {
            cart.items = cart.items.filter((it) => String(it.sweet) !== String(sweetId));
        }

        await sweet.save();
        await cart.save();
        res.json({ success: true, message: 'Cart updated', data: { cart, total: cart.getTotal() } });
    } catch (error) {
        console.error('Update cart error:', error);
        res.status(500).json({ success: false, message: 'Failed to update cart' });
    }
});

// remove single item from cart
router.delete('/item/:sweetId', async (req, res) => {
    try {
        const sweetId = req.params.sweetId;
        const cart = await getCart(req.user._id);
        const item = cart.items.find((it) => String(it.sweet) === String(sweetId));
        if (!item) return res.status(404).json({ success: false, message: 'Item not in cart' });

        const sweet = await Sweet.findById(sweetId);
        if (sweet) {
            sweet.quantity += item.quantity;
            await sweet.save();
        }

        cart.items = cart.items.filter((it) => String(it.sweet) !== String(sweetId));
        await cart.save();
        res.json({ success: true, message: 'Item removed', data: { cart, total: cart.getTotal() } });
    } catch (error) {
        console.error('Remove item error:', error);
        res.status(500).json({ success: false, message: 'Failed to remove item' });
    }
});

// clear entire cart and release stock
router.delete('/clear', async (req, res) => {
    try {
        const cart = await getCart(req.user._id);
        for (const it of cart.items) {
            const sweet = await Sweet.findById(it.sweet);
            if (sweet) {
                sweet.quantity += it.quantity;
                await sweet.save();
            }
        }
        cart.items = [];
        await cart.save();
        res.json({ success: true, message: 'Cart cleared', data: { cart, total: 0 } });
    } catch (error) {
        console.error('Clear cart error:', error);
        res.status(500).json({ success: false, message: 'Failed to clear cart' });
    }
});

module.exports = router;


