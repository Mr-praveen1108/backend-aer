const { generateAIResponse } = require('../services/chatService');

exports.sendMessage = async (req, res, next) => {
  try {
    const { message, history } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    const { reply, source } = await generateAIResponse(message.trim(), history || []);

    res.json({
      success: true,
      data: {
        reply,
        source,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getSuggestions = (req, res) => {
  res.json({
    success: true,
    data: [
      'How do I create a shipment?',
      'How can I track my delivery?',
      'What are the user roles?',
      'Explain shipment statuses',
      'How do I use the dashboard?',
    ],
  });
};
