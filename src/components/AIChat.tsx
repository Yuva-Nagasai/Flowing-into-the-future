import { useState, useRef, useEffect } from 'react';
import { X, Send, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { AIThinkingAnimation, AIPulseButton } from './animations';
import { productCategories } from '../data/productCatalog';

// Knowledge base about NanoFlows
const knowledgeBase = {
  company: {
    name: 'NanoFlows',
    description: 'NanoFlows is a leading digital solutions agency specializing in AI-powered services, custom development, and digital transformation.',
    email: 'nanoflowsvizag@gmail.com',
    phone: '+91 8019358855',
    location: 'TF-301, 1-152, Sapthagiri Nagar, Revenue Ward-70, Near Chinamushidiwada, Visakhapatnam - 530051',
  },
  services: [
    'AI & Machine Learning',
    'Custom Development',
    'Data Analytics',
    'Cybersecurity',
    'Cloud Solutions',
    'n8n Workflow Automation',
  ],
  products: productCategories.map(cat => ({
    category: cat.title,
    description: cat.description,
    items: cat.items.map(item => item.name),
  })),
  industries: [
    'AgriTech Application Development',
    'Dating App Development',
    'E-commerce App Development',
    'Grocery Delivery App Development',
    'EducationTech Software Development',
    'Financial Services Software Solutions',
    'FitnessTech App Development',
    'FoodTech Software Solutions',
    'Gaming App Development',
    'HealthTech App Development',
  ],
};

// Intelligent response generator
const generateResponse = (userMessage: string): string => {
  const message = userMessage.toLowerCase().trim();

  // Greetings
  if (message.match(/^(hi|hello|hey|greetings|good morning|good afternoon|good evening)/)) {
    return "Hello! I'm NanoFlows AI Assistant. I'm here to help you learn about our services, products, and how we can assist your business. What would you like to know?";
  }

  // Company information
  if (message.match(/(about|company|who are you|what is nanoflows|tell me about)/)) {
    return `NanoFlows is a leading digital solutions agency that specializes in AI-powered services, custom development, and digital transformation. We help businesses innovate with cutting-edge technology including AI & Machine Learning, Custom Development, Data Analytics, Cybersecurity, Cloud Solutions, and n8n Workflow Automation. Would you like to know more about any specific service?`;
  }

  // Contact information
  if (message.match(/(contact|email|phone|address|location|reach|get in touch)/)) {
    return `You can reach us at:\n📧 Email: ${knowledgeBase.company.email}\n📞 Phone: ${knowledgeBase.company.phone}\n📍 Location: ${knowledgeBase.company.location}\n\nYou can also fill out the contact form on our website or use the quick contact buttons. Would you like to schedule a consultation?`;
  }

  // Services
  if (message.match(/(service|what do you offer|what services|capabilities)/)) {
    const servicesList = knowledgeBase.services.join(', ');
    return `We offer comprehensive digital solutions including:\n\n${servicesList}\n\nOur services cover everything from AI & Machine Learning solutions to Custom Development, Data Analytics, Cybersecurity, Cloud Solutions, and n8n Workflow Automation. Which service interests you most?`;
  }

  // Products
  if (message.match(/(product|solutions|offerings|what products)/)) {
    const productsInfo = knowledgeBase.products.map(p => 
      `• ${p.category}: ${p.description}`
    ).join('\n');
    return `Our product portfolio includes:\n\n${productsInfo}\n\nEach category has multiple specialized solutions. Would you like details about a specific product category?`;
  }

  // AI & Machine Learning
  if (message.match(/(ai|artificial intelligence|machine learning|ml|neural|deep learning|nlp|chatbot)/)) {
    return `Our AI & Machine Learning services include:\n\n• Neural Networks & Deep Learning\n• Predictive Analytics & Forecasting\n• Natural Language Processing (NLP)\n• Intelligent Chatbots & Assistants\n• Custom AI Tools & Automation\n• AI Consulting & Training\n\nWe deploy advanced AI solutions for automation, predictive analytics, and natural language systems. Would you like to know more about any specific AI capability?`;
  }

  // Custom Development
  if (message.match(/(custom development|web development|app development|software development|development)/)) {
    return `Our Custom Development services include:\n\n• Web Application Development\n• Mobile App Development (iOS & Android)\n• SaaS Development & Multi-tenant Architecture\n• API & Microservices Development\n• Full-stack Development\n\nWe build scalable, modern applications tailored to your business needs. Are you looking to build a new application or modernize an existing one?`;
  }

  // Data Analytics
  if (message.match(/(data|analytics|business intelligence|bi|dashboard|reporting)/)) {
    return `Our Data Analytics solutions include:\n\n• Big Data Processing\n• Data Visualization\n• Business Intelligence Dashboards\n• Predictive Analytics\n• Customer Data & Analytics\n• Marketing Performance Dashboards\n\nWe help you visualize and interpret data with tailored analytics platforms. Would you like to know more about our analytics capabilities?`;
  }

  // Cloud Solutions
  if (message.match(/(cloud|devops|ci\/cd|migration|infrastructure|hosting)/)) {
    return `Our Cloud & Performance Platform services include:\n\n• Cloud Migration & Modernization\n• DevOps & CI/CD Automation\n• Performance Optimization Suite\n• Secure API & Microservices\n• Multi-region Infrastructure\n\nWe help you modernize and scale on secure, reliable cloud infrastructure. Are you planning a cloud migration?`;
  }

  // Pricing
  if (message.match(/(price|cost|pricing|how much|budget|quote|estimate)/)) {
    return `Pricing varies based on your specific project requirements, scope, and complexity. We offer customized solutions tailored to your needs and budget. I'd recommend scheduling a consultation with our team to discuss your project and get a detailed quote. Would you like me to help you contact our sales team?`;
  }

  // Demo
  if (message.match(/(demo|demonstration|show me|see|example|sample)/)) {
    return `We'd be happy to show you a demo of our solutions! You can:\n\n• Schedule a personalized demo with our team\n• Explore our AI Tools showcase at /ai-tools\n• Check out our case studies on the website\n• Contact us to arrange a live demonstration\n\nWhat type of solution would you like to see in action?`;
  }

  // Industries
  if (message.match(/(industry|industries|sector|vertical|agritech|ecommerce|healthtech|fintech|edtech)/)) {
    const industriesList = knowledgeBase.industries.slice(0, 6).join(', ');
    return `We serve multiple industries including:\n\n${industriesList}\n\n...and many more! We have expertise across various sectors. Which industry are you in? I can provide more specific information about solutions for your sector.`;
  }

  // Careers/Jobs
  if (message.match(/(career|job|hiring|position|openings|work|employment|join)/)) {
    return `We're always looking for talented individuals! You can:\n\n• Visit our Careers page to see open positions\n• Check out our team culture and values\n• Apply for roles in development, design, strategy, and more\n\nVisit /careers to explore current opportunities. Are you interested in a specific role?`;
  }

  // Help
  if (message.match(/(help|assist|support|what can you do|capabilities)/)) {
    return `I can help you with:\n\n• Information about our services and products\n• Company details and contact information\n• Industry-specific solutions\n• Scheduling consultations\n• General questions about NanoFlows\n\nWhat would you like to know? You can also use the quick action buttons below for faster responses.`;
  }

  // Default response with suggestions
  return `I understand you're asking about "${userMessage}". Let me help you! We offer a wide range of services including AI & Machine Learning, Custom Development, Data Analytics, Cybersecurity, and Cloud Solutions. Could you be more specific about what you're looking for? For example:\n\n• "Tell me about your AI services"\n• "What products do you offer?"\n• "How can I contact you?"\n• "Show me your services"`;
};

const AIChat = () => {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ text: string; isUser: boolean }>>([
    {
      text: "Hello! I'm NanoFlows AI Assistant. I can help you learn about our services, products, contact information, and more. How can I assist you today?",
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

    const userMessage = inputValue.trim();
    setMessages((prev) => [...prev, { text: userMessage, isUser: true }]);
    setIsTyping(true);
    setInputValue('');

    // Simulate thinking time (between 800ms to 1500ms for more natural feel)
    const thinkingTime = 800 + Math.random() * 700;

    setTimeout(() => {
      const response = generateResponse(userMessage);
      setMessages((prev) => [
        ...prev,
        { text: response, isUser: false },
      ]);
      setIsTyping(false);
    }, thinkingTime);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickAction = (query: string) => {
    setInputValue('');
    const userMessage = query;
    setMessages((prev) => [...prev, { text: userMessage, isUser: true }]);
    setIsTyping(true);
    const thinkingTime = 800 + Math.random() * 700;
    setTimeout(() => {
      const response = generateResponse(userMessage);
      setMessages((prev) => [
        ...prev,
        { text: response, isUser: false },
      ]);
      setIsTyping(false);
    }, thinkingTime);
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
              {[
                { label: 'Services', query: 'What services do you offer?' },
                { label: 'Products', query: 'Tell me about your products' },
                { label: 'Contact', query: 'How can I contact you?' },
                { label: 'AI Solutions', query: 'Tell me about your AI services' },
              ].map((quick) => (
                <button
                  key={quick.label}
                  onClick={() => handleQuickAction(quick.query)}
                  className={`text-xs px-3 py-1.5 rounded-full font-exo transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 ${
                    theme === 'dark'
                      ? 'bg-dark-lighter text-electric-blue border border-electric-blue/30 hover:bg-electric-blue hover:text-black focus:ring-electric-blue'
                      : 'bg-gray-100 text-accent-red border border-accent-red/30 hover:bg-accent-red hover:text-white focus:ring-accent-red'
                  }`}
                  aria-label={`Quick action: ${quick.label}`}
                >
                  {quick.label}
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
