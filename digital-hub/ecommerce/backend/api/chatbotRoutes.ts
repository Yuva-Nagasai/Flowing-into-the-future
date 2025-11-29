import { Router, Request, Response } from 'express';
import { db, schema } from '../db/index.js';
import { eq, like, desc, and, or } from 'drizzle-orm';
import { optionalAuth } from '../middleware/auth.js';

const router = Router();

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatContext {
  userId?: number;
  sessionId: string;
  messages: ChatMessage[];
}

const productSearchPatterns = [
  { patterns: ['find', 'search', 'looking for', 'show me', 'where can i get'], type: 'search' },
  { patterns: ['price', 'cost', 'how much', 'expensive', 'cheap'], type: 'price' },
  { patterns: ['shipping', 'delivery', 'deliver', 'ship'], type: 'shipping' },
  { patterns: ['return', 'refund', 'exchange', 'money back'], type: 'returns' },
  { patterns: ['order', 'track', 'status', 'where is my'], type: 'order' },
  { patterns: ['category', 'categories', 'types of', 'kinds of'], type: 'category' },
  { patterns: ['deal', 'discount', 'sale', 'offer', 'coupon'], type: 'deals' },
  { patterns: ['help', 'support', 'contact', 'speak to'], type: 'support' },
  { patterns: ['recommend', 'suggest', 'best', 'popular', 'top'], type: 'recommend' },
];

function detectIntent(message: string): string {
  const lowerMessage = message.toLowerCase();
  
  for (const pattern of productSearchPatterns) {
    if (pattern.patterns.some(p => lowerMessage.includes(p))) {
      return pattern.type;
    }
  }
  
  return 'general';
}

function extractProductQuery(message: string): string {
  const normalized = message
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  
  const stopWords = ['find', 'search', 'looking', 'for', 'show', 'me', 'i', 'want', 'need', 'buy', 'purchase', 'get', 'the', 'a', 'an', 'some', 'any', 'please', 'can', 'you', 'where', 'do', 'have'];
  const words = normalized.split(' ').filter(w => !stopWords.includes(w) && w.length > 2);
  
  if (words.length === 0) {
    const commonCategories = ['electronics', 'clothing', 'shoes', 'books', 'home', 'sports', 'beauty', 'toys', 'food'];
    for (const cat of commonCategories) {
      if (normalized.includes(cat)) {
        return cat;
      }
    }
  }
  
  return words.join(' ');
}

router.post('/chat', optionalAuth, async (req: Request, res: Response) => {
  try {
    const { message, sessionId = 'default' } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ success: false, error: 'Message is required' });
    }

    const intent = detectIntent(message);
    let response = '';
    let products: any[] = [];
    let categories: any[] = [];
    let deals: any[] = [];

    switch (intent) {
      case 'search':
        const query = extractProductQuery(message);
        if (db) {
          if (query && query.trim().length > 0) {
            products = await db.query.products.findMany({
              where: and(
                eq(schema.products.isActive, true),
                or(
                  like(schema.products.name, `%${query}%`),
                  like(schema.products.description, `%${query}%`)
                )
              ),
              limit: 5,
              with: { category: true },
            });
          } else {
            products = await db.query.products.findMany({
              where: and(eq(schema.products.isActive, true), eq(schema.products.featured, true)),
              limit: 5,
              with: { category: true },
            });
          }
        }
        
        if (products.length > 0) {
          if (query && query.trim().length > 0) {
            response = `I found ${products.length} product(s) matching "${query}". Here are some options:`;
          } else {
            response = 'Here are some of our featured products that you might like:';
          }
        } else {
          response = 'I couldn\'t find specific products matching your search. Would you like me to show you our popular items or browse by category?';
        }
        break;

      case 'price':
        response = 'Our prices vary by product. You can see the current price on each product page. Many items are on sale with up to 50% off! Would you like me to show you our current deals?';
        break;

      case 'shipping':
        response = 'We offer free shipping on orders over $100! Standard shipping typically takes 3-5 business days. Express shipping options are also available at checkout. Is there anything specific about shipping you\'d like to know?';
        break;

      case 'returns':
        response = 'We have a 30-day return policy. If you\'re not satisfied with your purchase, you can return it within 30 days for a full refund. Items must be unused and in original packaging. Would you like me to help you start a return?';
        break;

      case 'order':
        if (req.user) {
          response = 'You can view your order status in your account dashboard under "Orders". Would you like me to guide you there?';
        } else {
          response = 'To track your order, please log in to your account and go to the Orders section. You can also use the order number from your confirmation email.';
        }
        break;

      case 'category':
        if (db) {
          categories = await db.query.categories.findMany({
            where: eq(schema.categories.isActive, true),
            limit: 8,
          });
        }
        
        if (categories.length > 0) {
          response = 'Here are our product categories:';
        } else {
          response = 'We have various product categories including Electronics, Clothing, Home & Garden, Books, Sports, Beauty, Toys, and Food & Beverages. What interests you?';
        }
        break;

      case 'deals':
        if (db) {
          const now = new Date();
          deals = await db.query.deals.findMany({
            where: eq(schema.deals.isActive, true),
            limit: 5,
            orderBy: desc(schema.deals.priority),
          });
        }
        
        if (deals.length > 0) {
          response = `We have ${deals.length} active deal(s) right now! Check out our Deals page for all current offers.`;
        } else {
          response = 'Check out our Deals page for the latest offers and discounts. We regularly update with new promotions!';
        }
        break;

      case 'support':
        response = 'I\'m here to help! For immediate assistance, you can:\n\n1. Chat with me here\n2. Email us at support@nanoflows.com\n3. Visit our Contact page\n\nWhat can I help you with today?';
        break;

      case 'recommend':
        if (db) {
          products = await db.query.products.findMany({
            where: and(eq(schema.products.isActive, true), eq(schema.products.featured, true)),
            limit: 5,
            with: { category: true },
          });
        }
        
        if (products.length > 0) {
          response = 'Here are some of our most popular products that customers love:';
        } else {
          response = 'Check out our Featured Products section on the homepage for our top recommendations!';
        }
        break;

      default:
        response = 'Hello! I\'m your shopping assistant. I can help you:\n\n' +
          '🔍 Find products\n' +
          '💰 Check prices and deals\n' +
          '📦 Track orders\n' +
          '🚚 Learn about shipping\n' +
          '↩️ Handle returns\n' +
          '💬 Answer questions\n\n' +
          'What would you like to know?';
    }

    res.json({
      success: true,
      data: {
        response,
        intent,
        products: products.map(p => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          price: p.price,
          thumbnail: p.thumbnail,
          category: p.category?.name,
        })),
        categories: categories.map(c => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
        })),
        deals: deals.map(d => ({
          id: d.id,
          title: d.title,
          discountType: d.discountType,
          discountValue: d.discountValue,
        })),
        sessionId,
      },
    });
  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({ success: false, error: 'Failed to process message' });
  }
});

router.get('/suggestions', async (req: Request, res: Response) => {
  try {
    const suggestions = [
      'Show me popular products',
      'What deals are available?',
      'How does shipping work?',
      'What is your return policy?',
      'Show me electronics',
      'Find clothing on sale',
    ];

    res.json({ success: true, data: suggestions });
  } catch (error) {
    console.error('Suggestions error:', error);
    res.status(500).json({ success: false, error: 'Failed to get suggestions' });
  }
});

export default router;
