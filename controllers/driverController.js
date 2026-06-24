const Driver = require('../models/Driver');

exports.getDrivers = async (req, res, next) => {
  try {
    const drivers = await Driver.find().populate('vehicle_id', 'vehicle_number vehicle_type status');
    res.json({ success: true, data: drivers });
  } catch (error) {
    next(error);
  }
};

exports.createDriver = async (req, res, next) => {
  try {
    const driver = await Driver.create(req.body);
    const populated = await Driver.findById(driver._id).populate('vehicle_id', 'vehicle_number vehicle_type');
    res.status(201).json({ success: true, message: 'Driver created successfully', data: populated });
  } catch (error) {
    next(error);
  }
};

exports.updateDriver = async (req, res, next) => {
  try {
    const driver = await Driver.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('vehicle_id', 'vehicle_number vehicle_type');

    if (!driver) {
      return res.status(404).json({ success: false, message: 'Driver not found' });
    }

    res.json({ success: true, message: 'Driver updated successfully', data: driver });
  } catch (error) {
    next(error);
  }
};

exports.deleteDriver = async (req, res, next) => {
  try {
    const driver = await Driver.findById(req.params.id);

    if (!driver) {
      return res.status(404).json({ success: false, message: 'Driver not found' });
    }

    await driver.deleteOne();
    res.json({ success: true, message: 'Driver deleted successfully' });
  } catch (error) {
    next(error);
  }
};
