const express = require('express');
const { body } = require('express-validator');
const { getDrivers, createDriver, updateDriver, deleteDriver } = require('../controllers/driverController');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

const driverValidation = [
  body('name').trim().notEmpty().withMessage('Driver name is required'),
  body('phone').trim().notEmpty().withMessage('Phone is required'),
  body('license_number').trim().notEmpty().withMessage('License number is required'),
  validate,
];

router.use(protect);
router.use(authorize('admin'));

router.get('/', getDrivers);
router.post('/', driverValidation, createDriver);
router.put('/:id', driverValidation, updateDriver);
router.delete('/:id', deleteDriver);

module.exports = router;
