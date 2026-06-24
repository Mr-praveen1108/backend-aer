const Shipment = require('../models/Shipment');
const DeliveryUpdate = require('../models/DeliveryUpdate');
const generateTrackingNumber = require('../utils/generateTrackingNumber');

exports.getShipments = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};

    if (req.query.status) {
      filter.status = req.query.status;
    }

    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      filter.$or = [
        { tracking_number: searchRegex },
        { sender_name: searchRegex },
        { receiver_name: searchRegex },
        { cargo_type: searchRegex },
      ];
    }

    if (req.user.role === 'customer') {
      filter.created_by = req.user._id;
    }

    const total = await Shipment.countDocuments(filter);
    const shipments = await Shipment.find(filter)
      .populate('driver_id', 'name phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      data: shipments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getShipment = async (req, res, next) => {
  try {
    const shipment = await Shipment.findById(req.params.id).populate('driver_id', 'name phone license_number');

    if (!shipment) {
      return res.status(404).json({ success: false, message: 'Shipment not found' });
    }

    if (req.user.role === 'customer' && shipment.created_by?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this shipment' });
    }

    const updates = await DeliveryUpdate.find({ shipment_id: shipment._id })
      .populate('driver_id', 'name')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: { shipment, updates } });
  } catch (error) {
    next(error);
  }
};

exports.createShipment = async (req, res, next) => {
  try {
    const tracking_number = generateTrackingNumber();

    const shipment = await Shipment.create({
      ...req.body,
      tracking_number,
      created_by: req.user._id,
    });

    await DeliveryUpdate.create({
      shipment_id: shipment._id,
      status: 'pending',
      location: req.body.pickup_address,
    });

    res.status(201).json({ success: true, message: 'Shipment created successfully', data: shipment });
  } catch (error) {
    next(error);
  }
};

exports.updateShipment = async (req, res, next) => {
  try {
    let shipment = await Shipment.findById(req.params.id);

    if (!shipment) {
      return res.status(404).json({ success: false, message: 'Shipment not found' });
    }

    const previousStatus = shipment.status;
    shipment = await Shipment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (req.body.status && req.body.status !== previousStatus) {
      await DeliveryUpdate.create({
        shipment_id: shipment._id,
        driver_id: shipment.driver_id,
        status: req.body.status,
        location: req.body.location || shipment.delivery_address,
      });
    }

    res.json({ success: true, message: 'Shipment updated successfully', data: shipment });
  } catch (error) {
    next(error);
  }
};

exports.deleteShipment = async (req, res, next) => {
  try {
    const shipment = await Shipment.findById(req.params.id);

    if (!shipment) {
      return res.status(404).json({ success: false, message: 'Shipment not found' });
    }

    await DeliveryUpdate.deleteMany({ shipment_id: shipment._id });
    await shipment.deleteOne();

    res.json({ success: true, message: 'Shipment deleted successfully' });
  } catch (error) {
    next(error);
  }
};
