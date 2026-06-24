const express = require('express');
const { body } = require('express-validator');
const { getVehicles, createVehicle, updateVehicle, deleteVehicle } = require('../controllers/vehicleController');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

const vehicleValidation = [
  body('vehicle_number').trim().notEmpty().withMessage('Vehicle number is required'),
  body('vehicle_type')
    .isIn(['truck', 'van', 'pickup', 'trailer', 'container'])
    .withMessage('Invalid vehicle type'),
  body('capacity').isFloat({ min: 0 }).withMessage('Capacity must be a positive number'),
  body('status')
    .optional()
    .isIn(['available', 'in_use', 'maintenance', 'inactive'])
    .withMessage('Invalid status'),
  validate,
];

router.use(protect);
router.use(authorize('admin'));

router.get('/', getVehicles);
router.post('/', vehicleValidation, createVehicle);
router.put('/:id', vehicleValidation, updateVehicle);
router.delete('/:id', deleteVehicle);

module.exports = router;
