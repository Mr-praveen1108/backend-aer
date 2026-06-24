const express = require('express');
const { body } = require('express-validator');
const {
  getShipments,
  getShipment,
  createShipment,
  updateShipment,
  deleteShipment,
} = require('../controllers/shipmentController');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

const shipmentValidation = [
  body('sender_name').trim().notEmpty().withMessage('Sender name is required'),
  body('sender_phone').trim().notEmpty().withMessage('Sender phone is required'),
  body('receiver_name').trim().notEmpty().withMessage('Receiver name is required'),
  body('receiver_phone').trim().notEmpty().withMessage('Receiver phone is required'),
  body('pickup_address').trim().notEmpty().withMessage('Pickup address is required'),
  body('delivery_address').trim().notEmpty().withMessage('Delivery address is required'),
  body('cargo_type').trim().notEmpty().withMessage('Cargo type is required'),
  body('weight').isFloat({ min: 0 }).withMessage('Weight must be a positive number'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  validate,
];

router.use(protect);

router.get('/', getShipments);
router.get('/:id', getShipment);
router.post('/', shipmentValidation, createShipment);
router.put(
  '/:id',
  [
    body('status').optional().isIn(['pending', 'in_transit', 'delivered', 'cancelled']),
    validate,
  ],
  authorize('admin', 'driver'),
  updateShipment
);
router.delete('/:id', authorize('admin'), deleteShipment);

module.exports = router;
