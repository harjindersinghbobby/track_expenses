const express = require('express');
const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

const router = express.Router();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY, // ✅ pass API key here
});

router.post('/analyze', async (req, res) => {
  try {
    const { expenses } = req.body;

    const expenseList = expenses
      .map((e) => `- ₹${e.amount} on ${e.title} (${e.category}) at ${e.date}`)
      .join('\n');

    const prompt = `
Here are my expenses:
${expenseList}

Please analyze and tell me:
- My highest spending category
- My lowest spending category
- Total spending
- Suggestions to save money
`;

const { candidates } = await ai.models.generateContent({
  model: 'gemini-1.5-flash',
  contents: prompt,
});

   const text = candidates[0]?.content?.parts?.[0]?.text || 'No response received';
   res.json({ report: text });
  } catch (err) {
    console.error('❌ AI Analysis error:', err);
    res.status(500).json({ error: 'AI analysis failed' });
  }
});

module.exports = router;
