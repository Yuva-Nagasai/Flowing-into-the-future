const db = require('../config/db');

const jsonFields = ['categories', 'trust_badges', 'services'];

const fallbackSlides = [
  {
    id: '1',
    variant: 'default',
    title: 'Flowing Into',
    highlight: 'The Future',
    subtitle:
      'Experience seamless innovation with Nano Flows. We deliver cutting-edge AI-powered solutions that transform your digital presence through dynamic personalization and continuous evolution.',
    buttonText: 'Get Started',
    preHeading: 'AI-Powered Innovation Platform',
    primaryCtaLabel: 'Get Started',
    primaryCtaRoute: '/services',
    secondaryCtaLabel: 'Explore Solutions',
    secondaryCtaRoute: '/products',
    categories: [],
    trustBadges: [],
    services: [],
    backgroundImage: '/nanoflows-image.png',
    backgroundOverlay: 'rgba(2, 6, 23, 0.78)',
    orderIndex: 0,
  },
  {
    id: '2',
    variant: 'services',
    title: 'Every Capability You Need in One Studio',
    subtitle: 'NanoFlows Services',
    description: '',
    services: [
      { label: 'Custom Development', description: 'Web, mobile & API platforms', route: '/services#custom-development' },
      { label: 'Cloud Solutions', description: 'Migrations, DevOps & microservices', route: '/services#cloud-solutions' },
      { label: 'AI & ML Engineering', description: 'Intelligent automation & data models', route: '/services#ai-machine-learning' },
      { label: 'Performance Optimization', description: 'Speed, reliability & scalability', route: '/services#performance-optimization' },
      { label: 'Marketing & Campaigns', description: 'Growth marketing and brand reach', route: '/services#social-media-campaigns' },
      { label: 'YouTube Promotions', description: 'Channel growth & video SEO', route: '/services#youtube-promotions' },
    ],
    backgroundImage: null,
    backgroundOverlay: null,
    orderIndex: 1,
  },
  {
    id: '3',
    variant: 'showcase',
    preHeading: 'Welcome to NanoFlows',
    heading: 'Innovating Smarter Solutions with',
    highlight: 'Trusted Intelligence',
    description:
      'Engineering interactive and secure digital products across AI, automation, cloud, and data. Our pods blend strategy, design, and delivery to accelerate real business outcomes.',
    categories: ['AI', 'IoT', 'Digital Engineering', 'Data Analytics', 'Travel Tech', 'Web & Cloud'],
    primaryCtaLabel: 'Consult our expert',
    primaryCtaRoute: '/contact',
    secondaryCtaLabel: 'Explore services',
    secondaryCtaRoute: '/services',
    trustBadges: [],
    backgroundImage: null,
    backgroundOverlay: 'rgba(0, 0, 0, 0.72)',
    orderIndex: 2,
  },
  {
    id: '4',
    variant: 'showcase',
    preHeading: 'NanoFlows Academy',
    heading: 'Master In-Demand Skills with',
    highlight: 'E-Learning',
    description:
      'Transform your career with expert-led courses. Learn at your own pace with lifetime access, earn industry-recognized certificates, and join thousands of successful learners.',
    categories: ['Web Development', 'AI & Machine Learning', 'Cloud Computing', 'Data Science', 'DevOps', 'Cybersecurity'],
    primaryCtaLabel: 'Start Learning',
    primaryCtaRoute: '/elearning',
    secondaryCtaLabel: 'View All Courses',
    secondaryCtaRoute: '/elearning#courses',
    trustBadges: ['Industry Experts', 'Certificates', 'Lifetime Access'],
    backgroundImage: null,
    backgroundOverlay: 'rgba(4, 12, 27, 0.74)',
    orderIndex: 3,
  },
  {
    id: '5',
    variant: 'showcase',
    preHeading: 'AI-Powered Productivity',
    heading: 'Supercharge Your Workflow with',
    highlight: 'AI Tools',
    description:
      'Discover a curated collection of the most powerful AI tools. From content creation to data analysis, code generation to image synthesis – find the perfect tool for every task.',
    categories: ['Text Generation', 'Image Creation', 'Code Assistant', 'Audio & Video', 'Data Analysis', 'Automation'],
    primaryCtaLabel: 'Explore AI Tools',
    primaryCtaRoute: '/ai-tools',
    secondaryCtaLabel: 'Browse Categories',
    secondaryCtaRoute: '/ai-tools#categories',
    trustBadges: ['Free Tools', 'Premium Options', 'Expert Curated'],
    backgroundImage: null,
    backgroundOverlay: 'rgba(3, 7, 18, 0.8)',
    orderIndex: 4,
  },
  {
    id: '6',
    variant: 'showcase',
    preHeading: 'NanoFlows Store',
    heading: 'Premium Digital Products for',
    highlight: 'E-Commerce',
    description:
      'Shop our exclusive collection of digital products, templates, and solutions. Built with cutting-edge technology to accelerate your business growth and digital transformation.',
    categories: ['Templates', 'UI Kits', 'Plugins', 'Source Code', 'Digital Assets', 'Business Tools'],
    primaryCtaLabel: 'Visit Shop',
    primaryCtaRoute: '/shop',
    secondaryCtaLabel: 'View Best Sellers',
    secondaryCtaRoute: '/shop#featured',
    trustBadges: ['Secure Checkout', 'Instant Download', 'Premium Support'],
    backgroundImage: null,
    backgroundOverlay: 'rgba(3, 7, 18, 0.78)',
    orderIndex: 5,
  },
];

const parseSlideRow = (row) => {
  const slide = { ...row };
  jsonFields.forEach((field) => {
    if (slide[field]) {
      try {
        slide[field] = JSON.parse(slide[field]);
      } catch (error) {
        slide[field] = [];
      }
    } else {
      slide[field] = [];
    }
  });
  return {
    id: slide.id,
    variant: slide.variant,
    title: slide.title,
    highlight: slide.highlight,
    subtitle: slide.subtitle,
    buttonText: slide.button_text,
    preHeading: slide.pre_heading,
    heading: slide.heading,
    description: slide.description,
    categories: slide.categories,
    primaryCtaLabel: slide.primary_cta_label,
    primaryCtaRoute: slide.primary_cta_route,
    secondaryCtaLabel: slide.secondary_cta_label,
    secondaryCtaRoute: slide.secondary_cta_route,
    trustBadges: slide.trust_badges,
    services: Array.isArray(slide.services) ? slide.services : [],
    backgroundImage: slide.background_image,
    backgroundOverlay: slide.background_overlay,
    orderIndex: slide.order_index,
  };
};

const getNextOrderIndex = async () => {
  const result = await db.query('SELECT COALESCE(MAX(order_index), -1) AS maxOrder FROM hero_slides');
  // MySQL returns column aliases as given; ensure we handle casing correctly
  const maxOrder = result.rows[0].maxOrder ?? result.rows[0].maxorder ?? -1;
  return maxOrder + 1;
};

const shiftOrderIndexes = async (fromIndex, increment = 1) => {
  await db.query(
    'UPDATE hero_slides SET order_index = order_index + ? WHERE order_index >= ?',
    [increment, fromIndex]
  );
};

const normalizeOrderIndexes = async () => {
  const result = await db.query('SELECT id FROM hero_slides ORDER BY order_index ASC');
  const slides = result.rows;
  for (let i = 0; i < slides.length; i++) {
    await db.query('UPDATE hero_slides SET order_index = ? WHERE id = ?', [i, slides[i].id]);
  }
};

const calculateOrderIndex = async (position = 'end', referenceSlideId = null) => {
  if (position === 'start') {
    await shiftOrderIndexes(0, 1);
    return 0;
  }

  if (position === 'after' && referenceSlideId) {
    const refResult = await db.query('SELECT order_index FROM hero_slides WHERE id = ?', [referenceSlideId]);
    if (refResult.rows.length) {
      const refOrder = refResult.rows[0].order_index;
      await shiftOrderIndexes(refOrder + 1, 1);
      return refOrder + 1;
    }
  }

  if (position === 'before' && referenceSlideId) {
    const refResult = await db.query('SELECT order_index FROM hero_slides WHERE id = ?', [referenceSlideId]);
    if (refResult.rows.length) {
      const refOrder = refResult.rows[0].order_index;
      await shiftOrderIndexes(refOrder, 1);
      return refOrder;
    }
  }

  return await getNextOrderIndex();
};

const serializeArray = (value) => {
  if (!value) return null;
  if (Array.isArray(value)) return JSON.stringify(value);
  if (typeof value === 'string') {
    return JSON.stringify(
      value
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
    );
  }
  return JSON.stringify(value);
};

const buildPayload = (body) => {
  const {
    variant = 'default',
    title,
    highlight,
    subtitle,
    buttonText,
    preHeading,
    heading,
    description,
    categories,
    primaryCtaLabel,
    primaryCtaRoute,
    secondaryCtaLabel,
    secondaryCtaRoute,
    trustBadges,
    services,
    backgroundImage,
    backgroundOverlay,
  } = body;

  return {
    variant,
    title: title || null,
    highlight: highlight || null,
    subtitle: subtitle || null,
    button_text: buttonText || null,
    pre_heading: preHeading || null,
    heading: heading || null,
    description: description || null,
    categories: serializeArray(categories),
    primary_cta_label: primaryCtaLabel || null,
    primary_cta_route: primaryCtaRoute || null,
    secondary_cta_label: secondaryCtaLabel || null,
    secondary_cta_route: secondaryCtaRoute || null,
    trust_badges: serializeArray(trustBadges),
    services: serializeArray(services),
    background_image: backgroundImage || null,
    background_overlay: backgroundOverlay || null,
  };
};

const getHeroSlides = async (_req, res) => {
  try {
    if (!db.isDatabaseAvailable()) {
      return res.json({ slides: fallbackSlides });
    }
    const result = await db.query('SELECT * FROM hero_slides ORDER BY order_index ASC');
    const slides = result.rows.map(parseSlideRow);
    res.json({ slides: slides.length > 0 ? slides : fallbackSlides });
  } catch (error) {
    console.error('Get hero slides error:', error);
    res.json({ slides: fallbackSlides });
  }
};

const createHeroSlide = async (req, res) => {
  try {
    if (!db.isDatabaseAvailable()) {
      return res.status(503).json({ error: 'Database not available' });
    }

    const payload = buildPayload(req.body);
    const { position = 'end', referenceSlideId = null } = req.body;
    const orderIndex = await calculateOrderIndex(position, referenceSlideId);

    await db.query(
      `INSERT INTO hero_slides
        (variant, title, highlight, subtitle, button_text, pre_heading, heading, description,
         categories, primary_cta_label, primary_cta_route, secondary_cta_label, secondary_cta_route,
         trust_badges, background_image, background_overlay, services, order_index)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        payload.variant,
        payload.title,
        payload.highlight,
        payload.subtitle,
        payload.button_text,
        payload.pre_heading,
        payload.heading,
        payload.description,
        payload.categories,
        payload.primary_cta_label,
        payload.primary_cta_route,
        payload.secondary_cta_label,
        payload.secondary_cta_route,
        payload.trust_badges,
        payload.background_image,
        payload.background_overlay,
        payload.services,
        orderIndex,
      ]
    );

    const insertResult = await db.query(
      'SELECT * FROM hero_slides ORDER BY created_at DESC, id DESC LIMIT 1'
    );

    res.status(201).json({ slide: parseSlideRow(insertResult.rows[0]) });
  } catch (error) {
    console.error('Create hero slide error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const updateHeroSlide = async (req, res) => {
  try {
    if (!db.isDatabaseAvailable()) {
      return res.status(503).json({ error: 'Database not available' });
    }

    const { id } = req.params;
    const existingResult = await db.query('SELECT * FROM hero_slides WHERE id = ?', [id]);

    if (existingResult.rows.length === 0) {
      return res.status(404).json({ error: 'Slide not found' });
    }

    const payload = buildPayload(req.body);

    await db.query(
      `UPDATE hero_slides
       SET variant=?, title=?, highlight=?, subtitle=?, button_text=?, pre_heading=?, heading=?, description=?,
           categories=?, primary_cta_label=?, primary_cta_route=?, secondary_cta_label=?, secondary_cta_route=?,
           trust_badges=?, background_image=?, background_overlay=?, services=?, updated_at=CURRENT_TIMESTAMP
       WHERE id = ?`,
      [
        payload.variant,
        payload.title,
        payload.highlight,
        payload.subtitle,
        payload.button_text,
        payload.pre_heading,
        payload.heading,
        payload.description,
        payload.categories,
        payload.primary_cta_label,
        payload.primary_cta_route,
        payload.secondary_cta_label,
        payload.secondary_cta_route,
        payload.trust_badges,
        payload.background_image,
        payload.background_overlay,
        payload.services,
        id,
      ]
    );

    const { position, referenceSlideId } = req.body;
    if (position && ['start', 'end', 'after', 'before'].includes(position)) {
      await db.query('UPDATE hero_slides SET order_index = -1 WHERE id = ?', [id]);
      await normalizeOrderIndexes();
      const newOrderIndex = await calculateOrderIndex(position, referenceSlideId);
      await db.query('UPDATE hero_slides SET order_index = ? WHERE id = ?', [newOrderIndex, id]);
      await normalizeOrderIndexes();
    }

    const updatedResult = await db.query('SELECT * FROM hero_slides WHERE id = ?', [id]);
    res.json({ slide: parseSlideRow(updatedResult.rows[0]) });
  } catch (error) {
    console.error('Update hero slide error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const deleteHeroSlide = async (req, res) => {
  try {
    if (!db.isDatabaseAvailable()) {
      return res.status(503).json({ error: 'Database not available' });
    }

    const { id } = req.params;
    const existing = await db.query('SELECT * FROM hero_slides WHERE id = ?', [id]);

    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'Slide not found' });
    }

    await db.query('DELETE FROM hero_slides WHERE id = ?', [id]);

    await normalizeOrderIndexes();
    res.json({ message: 'Slide deleted successfully' });
  } catch (error) {
    console.error('Delete hero slide error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  getHeroSlides,
  createHeroSlide,
  updateHeroSlide,
  deleteHeroSlide,
};
