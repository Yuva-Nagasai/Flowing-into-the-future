import { motion } from 'framer-motion';
import {
  FileText,
  Clock,
  Tag,
  ArrowRight,
  ShoppingBag,
  Sparkles,
  Star,
  HeartHandshake
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import ShopNav from '../../components/shop/ShopNav';
import Footer from '../../components/Footer';
import SEOHead from '../../components/shop/SEOHead';

const ShopBlog = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();

  const pageInfo = {
    title: 'Digital Hub Blog',
    subtitle: 'Guides & Playbooks',
    description:
      'Practical guides, playbooks, and stories to help you choose, launch, and scale with high-impact digital products.',
  };

  const blogPosts = [
    {
      id: 1,
      title: 'How to Choose the Right Digital Product for Your Business',
      summary:
        'A simple framework for picking the perfect software, templates, or automations for your current stage—without wasting budget.',
      tags: ['Buying Guides', 'Strategy', 'SMBs'],
      readTime: '8 min read',
      color: 'from-blue-500 to-cyan-500',
      image: '/case1.jpg',
    },
    {
      id: 2,
      title: 'Top 10 Automation Workflows Our Customers Love',
      summary:
        'Real automation workflows that remove repetitive work in marketing, sales, and operations—based on what our customers actually use.',
      tags: ['Automation', 'Workflows', 'Playbooks'],
      readTime: '10 min read',
      color: 'from-emerald-500 to-green-500',
      image: '/case2.jpg',
    },
    {
      id: 3,
      title: 'Behind the Scenes: How We Curate Products on Digital Hub',
      summary:
        'Go inside our review process—how we vet new products, what we look for, and why not every product makes the cut.',
      tags: ['Inside Digital Hub', 'Curation', 'Quality'],
      readTime: '6 min read',
      color: 'from-amber-500 to-orange-500',
      image: '/case3.jpg',
    },
    {
      id: 4,
      title: 'Customer Journeys: From First Purchase to Power User',
      summary:
        'See how creators and teams go from first experiment to fully embedded workflows using our most-loved products.',
      tags: ['Case Studies', 'Retention', 'Onboarding'],
      readTime: '12 min read',
      color: 'from-purple-500 to-violet-500',
      image: '/case4.jpg',
    },
    {
      id: 5,
      title: 'Launch Playbook: Getting Value from a New Tool in 7 Days',
      summary:
        'A step-by-step launch checklist to ensure your team actually adopts the tools you buy—and sees value in the first week.',
      tags: ['Playbooks', 'Implementation', 'Teams'],
      readTime: '14 min read',
      color: 'from-rose-500 to-pink-500',
      image: '/case5.jpg',
    },
    {
      id: 6,
      title: 'How to Compare Lifetime Deals vs Subscriptions',
      summary:
        'Understand when lifetime deals make sense, what to watch for in the fine print, and how to compare them against SaaS pricing.',
      tags: ['Pricing', 'Lifetime Deals', 'Finance'],
      readTime: '9 min read',
      color: 'from-sky-500 to-blue-600',
      image: '/case6.jpg',
    },
  ];

  return (
    <div
      className={`min-h-screen w-full max-w-full overflow-x-hidden flex flex-col ${
        theme === 'dark' ? 'bg-slate-950' : 'bg-gray-50'
      }`}
    >
      <SEOHead
        title="Blog - Digital Hub Store"
        description="In-depth guides, playbooks, and stories from the Digital Hub team to help you buy and implement digital products with confidence."
      />
      <ShopNav />

      {/* Hero */}
      <section
        className={`relative overflow-hidden pt-32 pb-20 ${
          theme === 'dark'
            ? 'bg-gradient-to-b from-slate-900 to-slate-950'
            : 'bg-gradient-to-b from-white to-gray-50'
        }`}
      >
        <div
          className={`absolute top-0 right-0 w-[420px] h-[420px] rounded-full blur-3xl opacity-20 ${
            theme === 'dark' ? 'bg-electric-blue' : 'bg-accent-red'
          }`}
        />

        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6 ${
                theme === 'dark'
                  ? 'bg-electric-green/20 text-electric-green border border-electric-green/30'
                  : 'bg-accent-red/10 text-accent-red border border-accent-red/30'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              {pageInfo.subtitle}
            </motion.div>

            <h1
              className={`text-4xl md:text-6xl font-bold mb-6 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}
              style={{ fontFamily: 'Orbitron, sans-serif' }}
            >
              Digital Hub{' '}
              <span
                className={`bg-gradient-to-r ${
                  theme === 'dark'
                    ? 'from-electric-green to-electric-blue'
                    : 'from-accent-red to-accent-blue'
                } bg-clip-text text-transparent`}
              >
                Blog
              </span>
            </h1>

            <p
              className={`text-xl mb-8 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              {pageInfo.description}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Blog grid */}
      <section className={`py-20 ${theme === 'dark' ? 'bg-slate-950' : 'bg-gray-50'}`}>
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.map((post, idx) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`group rounded-2xl border cursor-pointer transition-all duration-300 overflow-hidden hover:shadow-xl flex flex-col h-full ${
                  theme === 'dark'
                    ? 'bg-slate-900 border-slate-800 hover:border-electric-blue/50'
                    : 'bg-white border-gray-200 hover:border-accent-red/50 shadow-md'
                }`}
              >
                {/* Thumbnail image */}
                {post.image && (
                  <div className="relative h-40 md:h-44 w-full overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br ${post.color} shadow-lg`}
                      >
                        <ShoppingBag className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <span
                      className={`absolute top-3 right-3 inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-full backdrop-blur-sm ${
                        theme === 'dark' ? 'bg-black/60 text-gray-200' : 'bg-white/80 text-gray-800'
                      }`}
                    >
                      <Clock className="w-3 h-3" />
                      {post.readTime}
                    </span>
                  </div>
                )}

                <div className="p-6 flex flex-col flex-1">
                  <h3
                    className={`text-xl font-bold mb-3 transition-colors line-clamp-2 min-h-[3.5rem] ${
                      theme === 'dark'
                        ? 'text-white group-hover:text-electric-green'
                        : 'text-gray-900 group-hover:text-accent-red'
                    }`}
                  >
                    {post.title}
                  </h3>

                  <p
                    className={`mb-4 text-sm leading-relaxed line-clamp-3 min-h-[4.5rem] flex-shrink-0 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}
                  >
                    {post.summary}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4 min-h-[2rem] flex-shrink-0">
                    {post.tags.map((tag, tagIdx) => (
                      <span
                        key={tagIdx}
                        className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                          theme === 'dark'
                            ? 'bg-slate-800 text-gray-300 border border-slate-700'
                            : 'bg-gray-100 text-gray-700 border border-gray-200'
                        }`}
                      >
                        <Tag className="w-3 h-3" />
                        {tag}
                      </span>
                    ))}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className={`relative group overflow-hidden mt-auto w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                      theme === 'dark'
                        ? 'bg-gradient-to-r from-electric-green to-electric-blue text-slate-950 hover:shadow-md hover:shadow-electric-blue/25'
                        : 'bg-gradient-to-r from-accent-red to-accent-blue text-white hover:shadow-md hover:shadow-accent-red/25'
                    }`}
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      Read More
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <div
                      className={`absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${
                        theme === 'dark'
                          ? 'bg-gradient-to-r from-electric-blue to-electric-green'
                          : 'bg-gradient-to-r from-accent-blue to-accent-red'
                      }`}
                    />
                  </motion.button>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className={`py-20 ${theme === 'dark' ? 'bg-slate-900' : 'bg-white'}`}>
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`max-w-3xl mx-auto text-center p-12 rounded-3xl ${
              theme === 'dark'
                ? 'bg-gradient-to-br from-electric-blue/20 to-electric-green/20 border border-electric-blue/30'
                : 'bg-gradient-to-br from-accent-red/10 to-accent-blue/10 border border-accent-red/30'
            }`}
          >
            <HeartHandshake
              className={`w-12 h-12 mx-auto mb-6 ${
                theme === 'dark' ? 'text-electric-green' : 'text-accent-red'
              }`}
            />
            <h2
              className={`text-3xl md:text-4xl font-bold mb-4 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}
            >
              Need Help Picking the Right{' '}
              <span
                className={`bg-gradient-to-r ${
                  theme === 'dark'
                    ? 'from-electric-blue to-electric-green'
                    : 'from-accent-red to-accent-blue'
                } bg-clip-text text-transparent`}
              >
                Product?
              </span>
            </h2>
            <p
              className={`text-lg mb-8 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              Tell us about your use case and budget—we&apos;ll send back a short list of
              curated products and workflows that fit.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/shop/contact')}
              className={`relative group overflow-hidden px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-2 mx-auto transition-all duration-300 ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-electric-green to-electric-blue text-slate-950'
                  : 'bg-gradient-to-r from-accent-red to-accent-blue text-white'
              }`}
            >
              <span className="relative z-10 flex items-center gap-2">
                Talk to Our Team
                <ArrowRight className="w-5 h-5" />
              </span>
              <div
                className={`absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${
                  theme === 'dark'
                    ? 'bg-gradient-to-r from-electric-blue to-electric-green'
                    : 'bg-gradient-to-r from-accent-blue to-accent-red'
                }`}
              />
            </motion.button>
            <div className="mt-4 flex items-center justify-center gap-2 text-sm">
              <Star
                className={`w-4 h-4 ${
                  theme === 'dark' ? 'text-electric-green' : 'text-accent-red'
                }`}
              />
              <p className={theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}>
                Personalized recommendations from our product specialists.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer variant="shop" />
    </div>
  );
};

export default ShopBlog;
