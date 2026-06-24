const mongoose = require('mongoose');

const shipmentSchema = new mongoose.Schema(
  {
    tracking_number: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    sender_name: {
      type: String,
      required: [true, 'Sender name is required'],
      trim: true,
    },
    sender_phone: {
      type: String,
      required: [true, 'Sender phone is required'],
      trim: true,
    },
    receiver_name: {
      type: String,
      required: [true, 'Receiver name is required'],
      trim: true,
    },
    receiver_phone: {
      type: String,
      required: [true, 'Receiver phone is required'],
      trim: true,
    },
    pickup_address: {
      type: String,
      required: [true, 'Pickup address is required'],
      trim: true,
    },
    delivery_address: {
      type: String,
      required: [true, 'Delivery address is required'],
      trim: true,
    },
    cargo_type: {
      type: String,
      required: [true, 'Cargo type is required'],
      trim: true,
    },
    weight: {
      type: Number,
      required: [true, 'Weight is required'],
      min: 0,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'in_transit', 'delivered', 'cancelled'],
      default: 'pending',
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    driver_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Driver',
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_, ret) => {
        ret.id = ret._id;
        ret.created_at = ret.createdAt;
        delete ret._id;
        delete ret.__v;
        delete ret.createdAt;
        delete ret.updatedAt;
        return ret;
      },
    },
  }
);

module.exports = mongoose.model('Shipment', shipmentSchema);
