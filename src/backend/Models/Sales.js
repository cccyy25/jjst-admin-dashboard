import mongoose from 'mongoose';

const SalesSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['Golden', 'Service/Product'],
        required: true,
    },
    depositCode: {
        type: String,
        default: '',
    },
    depositAmount: {
        type: Number,
        default: 0,
    },
    salesAmount: {
        type: Number,
        required: true,
    },
    paymentMethod: {
        type: String,
        enum: ['QR', 'Cash', 'Bank Transfer', 'Credit Card'],
        required: true,
    },
    responsiblePersons: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Staff',
    }],
    branch: {
        type: String,
        enum: ['bukit-indah', 'sri-petaling', 'cheras', 'subang', 'kota-damansara', 'puchong'],
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    surcharge: {
        type: Number,
        default: 0,
    },
    remarks: {
        type: String,
        default: '',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Virtual field for sales per pax
SalesSchema.virtual('salesPerPax').get(function() {
    if (this.responsiblePersons && this.responsiblePersons.length > 0) {
        return this.salesAmount / this.responsiblePersons.length;
    }
    return this.salesAmount;
});

// Ensure virtuals are included in JSON
SalesSchema.set('toJSON', { virtuals: true });
SalesSchema.set('toObject', { virtuals: true });

export const Sales = mongoose.models.Sales || mongoose.model('Sales', SalesSchema);