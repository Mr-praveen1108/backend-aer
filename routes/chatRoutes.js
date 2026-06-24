const express = require('express');
const { body } = require('express-validator');
const { sendMessage, getSuggestions } = require('../controllers/chatController');
const validate = require('../middleware/validate');

const router = express.Router();

router.get('/suggestions', getSuggestions);

router.post(
  '/',
  [
    body('message').trim().notEmpty().withMessage('Message is required'),
    body('history').optional().isArray().withMessage('History must be an array'),
    validate,
  ],
  sendMessage
);

module.exports = router;
