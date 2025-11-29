import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, Loader2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const quickReplies = [
  'Track my order',
  'Return policy',
  'Shipping info',
  'Contact support',
];

export default function ShopChatbot() {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! Welcome to NanoFlows Shop. How can I help you today?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (text?: string) => {
    const message = text || input.trim();
    if (!message) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    setTimeout(() => {
      const responses: Record<string, string> = {
        'track my order': 'To track your order, go to your Account Dashboard and click on "Orders". You can see the status and tracking information for all your orders there.',
        'return policy': 'We offer a 30-day return policy for all unused items in original packaging. To initiate a return, visit your order history and click "Return" next to the item.',
        'shipping info': 'We offer free shipping on orders over $50. Standard shipping takes 3-5 business days. Express shipping (1-2 days) is available for an additional fee.',
        'contact support': 'You can reach our support team at support@nanoflows.shop or call us at 1-800-NANO-SHOP. Our team is available Mon-Fri, 9AM-6PM EST.',
      };

      const lowerMessage = message.toLowerCase();
      let response = 'I appreciate your question! For detailed assistance, please contact our support team or check our FAQ section. Is there anything else I can help you with?';

      for (const [key, value] of Object.entries(responses)) {
        if (lowerMessage.includes(key)) {
          response = value;
          break;
        }
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
      setLoading(false);
    }, 1000);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={`fixed bottom-24 right-6 w-[360px] max-w-[calc(100vw-48px)] rounded-2xl overflow-hidden shadow-2xl z-50 ${
              theme === 'dark'
                ? 'bg-slate-900 border border-slate-700'
                : 'bg-white border border-gray-200'
            }`}
          >
            <div className={`flex items-center justify-between p-4 border-b ${
              theme === 'dark' ? 'border-slate-700 bg-slate-800' : 'border-gray-200 bg-gray-50'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  theme === 'dark'
                    ? 'bg-gradient-to-br from-electric-blue to-electric-green'
                    : 'bg-gradient-to-br from-accent-red to-accent-blue'
                }`}>
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Shop Assistant
                  </h4>
                  <p className={`text-xs ${theme === 'dark' ? 'text-electric-green' : 'text-green-500'}`}>
                    Online
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className={`p-2 rounded-full transition-colors ${
                  theme === 'dark' ? 'hover:bg-slate-700 text-gray-400' : 'hover:bg-gray-200 text-gray-500'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className={`h-80 overflow-y-auto p-4 space-y-4 ${
              theme === 'dark' ? 'bg-slate-900' : 'bg-gray-50'
            }`}>
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    msg.role === 'assistant'
                      ? theme === 'dark'
                        ? 'bg-electric-blue/20 text-electric-blue'
                        : 'bg-accent-blue/10 text-accent-blue'
                      : theme === 'dark'
                        ? 'bg-slate-700 text-gray-300'
                        : 'bg-gray-200 text-gray-600'
                  }`}>
                    {msg.role === 'assistant' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  </div>
                  <div className={`max-w-[70%] p-3 rounded-2xl ${
                    msg.role === 'assistant'
                      ? theme === 'dark'
                        ? 'bg-slate-800 text-gray-200'
                        : 'bg-white text-gray-800 shadow-sm'
                      : theme === 'dark'
                        ? 'bg-electric-blue text-slate-900'
                        : 'bg-accent-blue text-white'
                  }`}>
                    <p className="text-sm">{msg.content}</p>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    theme === 'dark' ? 'bg-electric-blue/20 text-electric-blue' : 'bg-accent-blue/10 text-accent-blue'
                  }`}>
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className={`p-3 rounded-2xl ${
                    theme === 'dark' ? 'bg-slate-800' : 'bg-white shadow-sm'
                  }`}>
                    <Loader2 className={`w-4 h-4 animate-spin ${
                      theme === 'dark' ? 'text-electric-blue' : 'text-accent-blue'
                    }`} />
                  </div>
                </div>
              )}
            </div>

            <div className={`p-4 border-t ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
              <div className="flex flex-wrap gap-2 mb-3">
                {quickReplies.map((reply) => (
                  <button
                    key={reply}
                    onClick={() => handleSend(reply)}
                    className={`px-3 py-1 text-xs rounded-full transition-colors ${
                      theme === 'dark'
                        ? 'bg-slate-800 text-gray-300 hover:bg-slate-700'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {reply}
                  </button>
                ))}
              </div>

              <form
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a message..."
                  className={`flex-1 px-4 py-2 rounded-xl border transition-all focus:outline-none focus:ring-2 ${
                    theme === 'dark'
                      ? 'bg-slate-800 border-slate-700 text-white placeholder:text-gray-500 focus:border-electric-blue focus:ring-electric-blue/20'
                      : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-accent-blue focus:ring-accent-blue/20'
                  }`}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className={`p-2 rounded-xl transition-all disabled:opacity-50 ${
                    theme === 'dark'
                      ? 'bg-electric-green text-slate-900 hover:bg-electric-green/90'
                      : 'bg-accent-blue text-white hover:bg-accent-blue/90'
                  }`}
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg flex items-center justify-center z-50 transition-colors ${
          isOpen
            ? theme === 'dark' ? 'bg-slate-700' : 'bg-gray-200'
            : theme === 'dark'
              ? 'bg-gradient-to-r from-electric-blue to-electric-green'
              : 'bg-gradient-to-r from-accent-red to-accent-blue'
        }`}
      >
        {isOpen ? (
          <X className={`w-6 h-6 ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`} />
        ) : (
          <MessageCircle className="w-6 h-6 text-white" />
        )}
      </motion.button>
    </>
  );
}
