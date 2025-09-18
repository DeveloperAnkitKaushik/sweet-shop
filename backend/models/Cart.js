const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    sweet: { type: mongoose.Schema.Types.ObjectId, ref: 'Sweet', required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1, max: 5 },
    imageUrl: { type: String }
}, { _id: false });

const cartSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true, required: true },
    items: { type: [cartItemSchema], default: [] },
    updatedAt: { type: Date, default: Date.now }
});

// sum of all cart line items
cartSchema.methods.getTotal = function () {
    return this.items.reduce((sum, it) => sum + it.price * it.quantity, 0);
};

// bump updatedAt on save
cartSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});

module.exports = mongoose.model('Cart', cartSchema);


