import React, { useState, useRef, useEffect } from 'react';
import * as chatService from '../services/chatService';
import './FloatingChatBubble.css';

export default function FloatingChatBubble() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      text: 'Hey there! 🤖 I\'m your AI crypto assistant. Ask me anything about Bitcoin, Ethereum, portfolio strategies, or crypto trends!',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!input.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      text: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      // Send to backend API
      const response = await chatService.sendChatMessage(input);

      if (response.success) {
        const aiMessage = {
          id: messages.length + 2,
          type: 'ai',
          text: response.message,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        setError('Failed to get response');
      }
    } catch (err) {
      console.error('Chat error:', err);
      setError(err.message || 'Error connecting to AI');
      
      // Add error message to chat
      const errorMessage = {
        id: messages.length + 2,
        type: 'error',
        text: '❌ Oops! Failed to get a response. Please try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Bubble */}
      <div className="chat-bubble-container">
        <button
          className={`chat-bubble ${isOpen ? 'open' : ''}`}
          onClick={() => setIsOpen(!isOpen)}
          title={isOpen ? 'Close chat' : 'Open chat'}
        >
          <span className="bubble-icon">🤖</span>
          <span className="bubble-pulse"></span>
        </button>
      </div>

      {/* Chat Panel */}
      {isOpen && (
        <div className="chat-panel">
          {/* Header */}
          <div className="chat-header">
            <div className="header-content">
              <div className="header-icon">🤖</div>
              <div className="header-text">
                <h3>AI Crypto Assistant</h3>
                <p>Powered by Groq</p>
              </div>
            </div>
            <button
              className="close-chat-btn"
              onClick={() => setIsOpen(false)}
              title="Close"
            >
              ✕
            </button>
          </div>

          {/* Messages Container */}
          <div className="chat-messages">
            {messages.map(msg => (
              <div key={msg.id} className={`message ${msg.type}`}>
                <div className="message-avatar">
                  {msg.type === 'ai' ? '🤖' : '👤'}
                </div>
                <div className="message-content">
                  <div className="message-text">{msg.text}</div>
                  <div className="message-time">
                    {msg.timestamp.toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="message ai">
                <div className="message-avatar">🤖</div>
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Error Message */}
          {error && (
            <div className="chat-error">
              <span>⚠️ {error}</span>
              <button onClick={() => setError(null)}>Dismiss</button>
            </div>
          )}

          {/* Input Form */}
          <form onSubmit={handleSendMessage} className="chat-input-form">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about crypto, portfolio, prices..."
              disabled={loading}
              className="chat-input"
              maxLength={300}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="send-btn"
              title="Send message"
            >
              {loading ? '⏳' : '➤'}
            </button>
          </form>

          {/* Character Counter */}
          <div className="char-count">
            {input.length}/300
          </div>
        </div>
      )}
    </>
  );
}