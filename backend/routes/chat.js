const express = require('express');
const router = express.Router();
const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "dummy-key", // Prevent crash if key is missing
  dangerouslyAllowBrowser: true // Just in case, though not needed for backend
});

router.post('/', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: "You are Arogyata Bot, a helpful assistant for a healthcare data platform. You help users understand how to use the platform, upload records, and manage permissions. Keep answers concise." },
        { role: "user", content: message }
      ],
      model: "gpt-3.5-turbo",
    });

    const reply = completion.choices[0].message.content;

    res.json({ reply });
  } catch (error) {
    console.error('OpenAI Error:', error.message);
    
    // Fallback response if API fails (e.g., quota exceeded)
    const fallbackReply = "I'm currently running in offline mode (OpenAI Quota Exceeded). I can help you with basic questions about Arogyata. Try asking about 'features' or 'upload'.";
    
    // Simple keyword matching for fallback
    const lowerMsg = req.body.message.toLowerCase();
    let reply = fallbackReply;
    
    if (lowerMsg.includes('hello') || lowerMsg.includes('hi')) {
      reply = "Hello! I am Arogyata Bot. How can I help you?";
    } else if (lowerMsg.includes('feature')) {
      reply = "Arogyata offers decentralized storage, end-to-end encryption, and smart contract access control.";
    } else if (lowerMsg.includes('upload')) {
      reply = "You can upload health records securely via the Dashboard. All files are encrypted before storage.";
    }

    res.json({ reply });
  }
});

module.exports = router;
