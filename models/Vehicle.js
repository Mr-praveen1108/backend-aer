const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema(
  {
    vehicle_number: {
      type: String,
      required: [true, 'Vehicle number is required'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    vehicle_type: {
      type: String,
      required: [true, 'Vehicle type is required'],
      enum: ['truck', 'van', 'pickup', 'trailer', 'container'],
    },
    capacity: {
      type: Number,
      required: [true, 'Capacity is required'],
      min: 0,
    },
    status: {
      type: String,
      enum: ['available', 'in_use', 'maintenance', 'inactive'],
      default: 'available',
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

module.exports = mongoose.model('Vehicle', vehicleSchema);
