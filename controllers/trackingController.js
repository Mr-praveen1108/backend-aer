const Shipment = require('../models/Shipment');
const DeliveryUpdate = require('../models/DeliveryUpdate');

exports.trackShipment = async (req, res, next) => {
  try {
    const { trackingNumber } = req.params;

    const shipment = await Shipment.findOne({
      tracking_number: trackingNumber.toUpperCase(),
    }).populate('driver_id', 'name phone');

    if (!shipment) {
      return res.status(404).json({ success: false, message: 'Shipment not found with this tracking number' });
    }

    const updates = await DeliveryUpdate.find({ shipment_id: shipment._id })
      .populate('driver_id', 'name')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        shipment: {
          tracking_number: shipment.tracking_number,
          sender_name: shipment.sender_name,
          receiver_name: shipment.receiver_name,
          pickup_address: shipment.pickup_address,
          delivery_address: shipment.delivery_address,
          cargo_type: shipment.cargo_type,
          weight: shipment.weight,
          status: shipment.status,
          driver: shipment.driver_id,
          created_at: shipment.createdAt,
        },
        updates,
      },
    });
  } catch (error) {
    next(error);
  }
};
