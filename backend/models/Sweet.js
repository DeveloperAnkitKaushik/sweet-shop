const mongoose = require('mongoose');

const sweetSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Sweet name is required'],
        trim: true,
        minlength: [2, 'Sweet name must be at least 2 characters long'],
        unique: true
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative']
    },
    quantity: {
        type: Number,
        required: [true, 'Quantity is required'],
        min: [0, 'Quantity cannot be negative'],
        default: 0
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, 'Description cannot exceed 500 characters']
    },
    imageUrl: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

// enable text search on name/description
sweetSchema.index({ name: 'text', description: 'text' });

// true if item is in stock
sweetSchema.virtual('isAvailable').get(function () {
    return this.quantity > 0;
});

sweetSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Sweet', sweetSchema);
