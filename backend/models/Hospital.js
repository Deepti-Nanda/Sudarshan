const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        required: true,
        default: 'Point',
      },
      coordinates: {
        type: [Number],
        required: true,
        // [longitude, latitude]
      },
    },
    emergencyTypes: [
      {
        type: String,
        enum: ['Cardiac', 'Accident', 'Respiratory', 'Stroke', 'Burns', 'Maternity', 'Pediatric', 'Poisoning', 'General'],
      },
    ],
    status: {
      generalBeds: {
        type: Number,
        default: 0,
        min: 0,
      },
      icuBeds: {
        type: Number,
        default: 0,
        min: 0,
      },
      ventilators: {
        type: Number,
        default: 0,
        min: 0,
      },
      bloodBankAvail: {
        type: Boolean,
        default: false,
      },
      operationTheaterFree: {
        type: Boolean,
        default: false,
      },
      ambulanceAvail: {
        type: Number,
        default: 0,
        min: 0,
      },
      currentLoad: {
        type: String,
        enum: ['Low', 'Moderate', 'High'],
        default: 'Low',
      },
    },
    facilities: [
      {
        type: String,
      },
    ],
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    adminPassword: {
      type: String,
      default: 'admin123',
    },
  },
  {
    timestamps: true,
  }
);

// Create 2dsphere index for geospatial queries
hospitalSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Hospital', hospitalSchema);
