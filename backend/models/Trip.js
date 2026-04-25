const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    tripDetails: {
      source: { type: String, required: true },
      destination: { type: String, required: true },
      travelMode: {
        type: String,
        enum: ['flight', 'train', 'bus', 'car'],
        required: true,
      },
      budget: { type: mongoose.Schema.Types.Mixed, default: 'medium' },
      days: { type: Number, required: true, min: 1, max: 30 },
      people: { type: Number, required: true, min: 1, max: 20 },
      preferences: [{ type: String }],
    },
    itinerary: {
      type: mongoose.Schema.Types.Mixed, // Stores the full AI-generated JSON
      required: true,
    },
    rawResponse: {
      type: String, // Full AI text response as backup
      default: '',
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster user-based queries
tripSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Trip', tripSchema);