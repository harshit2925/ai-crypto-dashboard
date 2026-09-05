const axios = require('axios');

// Groq API configuration
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// System prompt for crypto assistant
const SYSTEM_PROMPT = `You are an expert cryptocurrency and investment advisor AI. You provide helpful, accurate, and friendly advice about:
- Cryptocurrency prices, trends, and market analysis
- Bitcoin, Ethereum, and other cryptocurrencies
- Portfolio management strategies
- Risk management for crypto investments
- Market sentiment and news analysis
- Technical and fundamental analysis

Always be honest about risks and never guarantee profits. Keep responses concise and friendly. Use emojis to make conversations engaging.
You have access to general crypto knowledge up to your training date. Always recommend doing your own research.`;

// Send message to Groq API
exports.askAI = async (req, res) => {
  try {
    const userId = req.user.id;
    const { message } = req.body;

    // Validate input
    if (!message || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Message cannot be empty',
      });
    }

    if (!GROQ_API_KEY) {
      console.error('❌ GROQ_API_KEY not configured');
      return res.status(500).json({
        success: false,
        message: 'AI service not configured. Please add GROQ_API_KEY to .env',
      });
    }

    console.log(`📨 Chat request from user ${userId}: "${message}"`);
    console.log(`🔑 Using Groq API Key: ${GROQ_API_KEY.substring(0, 10)}...`);

    try {
      // Call Groq API
      const response = await axios.post(
        GROQ_API_URL,
        {
          model: 'groq/compound-mini',
          messages: [
            {
              role: 'system',
              content: SYSTEM_PROMPT,
            },
            {
              role: 'user',
              content: message,
            },
          ],
          temperature: 0.7,
          max_tokens: 500,
          top_p: 0.9,
        },
        {
          headers: {
            'Authorization': `Bearer ${GROQ_API_KEY}`,
            'Content-Type': 'application/json',
          },
          timeout: 30000, // 30 second timeout
        }
      );

      if (response.data && response.data.choices && response.data.choices.length > 0) {
        const aiMessage = response.data.choices[0].message.content;
        
        console.log(`✅ AI response generated successfully`);

        res.json({
          success: true,
          message: aiMessage,
        });
      } else {
        throw new Error('No response from Groq API');
      }
    } catch (groqError) {
      console.error('❌ Groq API Error:', {
        status: groqError.response?.status,
        message: groqError.response?.data?.error?.message || groqError.message,
        data: groqError.response?.data,
      });

      // Provide helpful error message
      let errorMessage = 'Sorry, I had trouble thinking. Please try again.';
      
      if (groqError.response?.status === 400) {
        errorMessage = 'Bad request to AI service. Check your API key.';
      } else if (groqError.response?.status === 401) {
        errorMessage = 'AI service authentication failed. Invalid API key.';
      } else if (groqError.response?.status === 429) {
        errorMessage = 'Too many requests. Please wait a moment and try again.';
      } else if (groqError.response?.status === 500) {
        errorMessage = 'AI service is temporarily unavailable.';
      }

      res.status(500).json({
        success: false,
        message: errorMessage,
        error: groqError.message,
      });
    }
  } catch (error) {
    console.error('❌ Chat Controller Error:', error.message);
    
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

// Get chat history (optional - for future enhancement)
exports.getChatHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // TODO: Store and retrieve chat history from MongoDB
    // For now, just return empty array
    
    res.json({
      success: true,
      data: [],
      message: 'Chat history retrieval coming soon',
    });
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching chat history',
      error: error.message,
    });
  }
};