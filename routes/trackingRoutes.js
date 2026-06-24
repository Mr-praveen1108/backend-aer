const express = require('express');
const { trackShipment } = require('../controllers/trackingController');

const router = express.Router();

router.get('/:trackingNumber', trackShipment);

module.exports = router;
