const { getKnowledgeAnswer, SYSTEM_PROMPT } = require('../utils/cargoKnowledge');

const generateAIResponse = async (message, history = []) => {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return {
      reply: getKnowledgeAnswer(message),
      source: 'knowledge',
    };
  }

  try {
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...history.slice(-8).map((m) => ({ role: m.role, content: m.content })),
      { role: 'user', content: message },
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        messages,
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error?.message || 'OpenAI API request failed');
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content?.trim();

    if (!reply) throw new Error('Empty response from AI');

    return { reply, source: 'openai' };
  } catch (error) {
    console.error('OpenAI fallback:', error.message);
    return {
      reply: getKnowledgeAnswer(message),
      source: 'knowledge',
    };
  }
};

module.exports = { generateAIResponse };
