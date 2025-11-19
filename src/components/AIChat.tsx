import { useState, useRef, useEffect } from 'react';
import { X, Send, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { AIThinkingAnimation, AIPulseButton } from './animations';

const AIChat = () => {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ text: string; isUser: boolean }>>([
    {
      text: "Hello! I'm your AI assistant. How can I help you explore Nano Flows today?",
      isUser: false,
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    setMessages((prev) => [...prev, { text: inputValue, isUser: true }]);
    setIsTyping(true);

    setTimeout(() => {
      const responses = [
        "Thanks for reaching out! Our team specializes in AI-powered solutions. Would you like to know more about our services?",
        "That's a great question! Nano Flows offers comprehensive digital transformation services. Let me help you with that.",
        "I'd be happy to assist you with that. Our platform provides real-time analytics and seamless integration capabilities.",
        "Excellent! We have solutions for various industries. Would you like to schedule a demo with our team?",
      ];

      setMessages((prev) => [
        ...prev,
        { text: responses[Math.floor(Math.random() * responses.length)], isUser: false },
      ]);
      setIsTyping(false);
    }, 1000);

    setInputValue('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsOpen(true)}
            className={`fixed bottom-6 right-6 sm:bottom-8 sm:right-8 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center z-50 transition-all duration-300 hover:scale-110 animate-pulse-slow focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              theme === 'dark'
                ? 'bg-electric-blue text-black glow-blue focus:ring-electric-blue'
                : 'bg-accent-red text-white glow-red focus:ring-accent-red'
            }`}
            aria-label="Open AI chat assistant"
          >
            <Bot size={28} strokeWidth={1.5} aria-hidden="true" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 md:left-auto md:right-6 md:translate-x-0 sm:bottom-8 sm:right-8 w-[calc(100%-2rem)] sm:w-[400px] max-w-md h-[500px] rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden ${
            theme === 'dark'
              ? 'bg-dark-card border-2 border-electric-blue glow-blue'
              : 'bg-white border-2 border-accent-red glow-red'
          }`}
            role="dialog"
            aria-labelledby="chat-title"
            aria-modal="true"
          >
          <div
            className={`flex items-center justify-between p-4 border-b ${
              theme === 'dark'
                ? 'bg-electric-blue/10 border-electric-blue/20'
                : 'bg-accent-red/10 border-accent-red/20'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  theme === 'dark' ? 'bg-electric-blue text-black' : 'bg-accent-red text-white'
                }`}
                aria-hidden="true"
              >
                <Bot size={24} />
              </div>
              <div>
                <h3
                  id="chat-title"
                  className={`font-orbitron font-bold text-sm sm:text-base ${
                    theme === 'dark' ? 'text-white' : 'text-black'
                  }`}
                >
                  Nano AI Assistant
                </h3>
                <p
                  className={`text-xs font-exo flex items-center ${
                    theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                  }`}
                >
                  <span
                    className={`inline-block w-2 h-2 rounded-full mr-1 ${
                      theme === 'dark' ? 'bg-electric-green' : 'bg-green-500'
                    }`}
                    aria-hidden="true"
                  />
                  Online
                </p>
              </div>
            </div>

            <button
              onClick={handleClose}
              className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 ${
                theme === 'dark'
                  ? 'text-gray-400 hover:text-white hover:bg-dark-lighter focus:ring-electric-blue'
                  : 'text-gray-800 hover:text-gray-900 hover:bg-gray-100 focus:ring-accent-red'
              }`}
              aria-label="Close chat"
            >
              <X size={20} />
            </button>
          </div>

          <div
            className={`flex-1 overflow-y-auto p-4 space-y-4 ${
              theme === 'dark' ? 'bg-dark-bg' : 'bg-gray-50'
            }`}
            role="log"
            aria-live="polite"
            aria-atomic="false"
          >
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} animate-float`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 font-exo text-sm sm:text-base ${
                    message.isUser
                      ? theme === 'dark'
                        ? 'bg-electric-blue text-black'
                        : 'bg-accent-red text-white'
                      : theme === 'dark'
                      ? 'bg-dark-card text-white border border-electric-blue/20'
                      : 'bg-white text-black border border-gray-200 shadow-md'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 font-exo text-sm sm:text-base ${
                    theme === 'dark'
                      ? 'bg-dark-card text-white border border-electric-blue/20'
                      : 'bg-white text-black border border-gray-200 shadow-md'
                  }`}
                >
                  <AIThinkingAnimation size="md" />
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div
            className={`p-4 border-t ${
              theme === 'dark'
                ? 'bg-dark-card border-electric-blue/20'
                : 'bg-white border-gray-200'
            }`}
          >
            <div className="flex space-x-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className={`flex-1 px-4 py-3 rounded-lg font-exo text-sm sm:text-base focus:outline-none transition-all duration-300 focus:ring-2 ${
                  theme === 'dark'
                    ? 'bg-dark-lighter text-white border border-electric-blue/20 focus:border-electric-blue focus:ring-electric-blue placeholder-gray-500'
                    : 'bg-gray-50 text-black border border-gray-300 focus:border-accent-red focus:ring-accent-red placeholder-gray-400'
                }`}
                aria-label="Chat message input"
              />
              <AIPulseButton
                onClick={handleSend}
                disabled={!inputValue.trim()}
                variant="secondary"
                className="px-4 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={20} />
              </AIPulseButton>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {['Services', 'Pricing', 'Demo', 'Contact'].map((quick) => (
                <button
                  key={quick}
                  onClick={() => setInputValue(`Tell me about ${quick.toLowerCase()}`)}
                  className={`text-xs px-3 py-1.5 rounded-full font-exo transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 ${
                    theme === 'dark'
                      ? 'bg-dark-lighter text-electric-blue border border-electric-blue/30 hover:bg-electric-blue hover:text-black focus:ring-electric-blue'
                      : 'bg-gray-100 text-accent-red border border-accent-red/30 hover:bg-accent-red hover:text-white focus:ring-accent-red'
                  }`}
                  aria-label={`Quick action: ${quick}`}
                >
                  {quick}
                </button>
              ))}
            </div>
          </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChat;
