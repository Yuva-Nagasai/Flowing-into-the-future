const db = require('../config/db');

const jsonFields = ['categories', 'trust_badges', 'services'];

const fallbackSlides = [
  {
    id: '1',
    variant: 'default',
    title: 'Flowing Into',
    highlight: 'The Future',
    subtitle: 'Experience seamless innovation with Nano Flows. We deliver cutting-edge AI-powered solutions that transform your digital presence through dynamic personalization and continuous evolution.',
    buttonText: 'Get Started',
    preHeading: 'AI-Powered Innovation Platform',
    heading: null,
    description: null,
    categories: [],
    primaryCtaLabel: 'Get Started',
    primaryCtaRoute: '/services',
    secondaryCtaLabel: 'Explore Solutions',
    secondaryCtaRoute: '/products',
    trustBadges: [],
    services: [],
    backgroundImage: null,
    backgroundOverlay: null,
    orderIndex: 0,
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
  return result.rows[0].maxorder + 1;
};

const shiftOrderIndexes = async (fromIndex, increment = 1) => {
  await db.query(
    'UPDATE hero_slides SET order_index = order_index + $1 WHERE order_index >= $2',
    [increment, fromIndex]
  );
};

const normalizeOrderIndexes = async () => {
  const result = await db.query('SELECT id FROM hero_slides ORDER BY order_index ASC');
  const slides = result.rows;
  for (let i = 0; i < slides.length; i++) {
    await db.query('UPDATE hero_slides SET order_index = $1 WHERE id = $2', [i, slides[i].id]);
  }
};

const calculateOrderIndex = async (position = 'end', referenceSlideId = null) => {
  if (position === 'start') {
    await shiftOrderIndexes(0, 1);
    return 0;
  }

  if (position === 'after' && referenceSlideId) {
    const refResult = await db.query('SELECT order_index FROM hero_slides WHERE id = $1', [referenceSlideId]);
    if (refResult.rows.length) {
      const refOrder = refResult.rows[0].order_index;
      await shiftOrderIndexes(refOrder + 1, 1);
      return refOrder + 1;
    }
  }

  if (position === 'before' && referenceSlideId) {
    const refResult = await db.query('SELECT order_index FROM hero_slides WHERE id = $1', [referenceSlideId]);
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

    const insertResult = await db.query(
      `INSERT INTO hero_slides
        (variant, title, highlight, subtitle, button_text, pre_heading, heading, description,
         categories, primary_cta_label, primary_cta_route, secondary_cta_label, secondary_cta_route,
         trust_badges, background_image, background_overlay, services, order_index)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
       RETURNING *`,
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
    const existingResult = await db.query('SELECT * FROM hero_slides WHERE id = $1', [id]);

    if (existingResult.rows.length === 0) {
      return res.status(404).json({ error: 'Slide not found' });
    }

    const payload = buildPayload(req.body);

    await db.query(
      `UPDATE hero_slides
       SET variant=$1, title=$2, highlight=$3, subtitle=$4, button_text=$5, pre_heading=$6, heading=$7, description=$8,
           categories=$9, primary_cta_label=$10, primary_cta_route=$11, secondary_cta_label=$12, secondary_cta_route=$13,
           trust_badges=$14, background_image=$15, background_overlay=$16, services=$17, updated_at=NOW()
       WHERE id = $18`,
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
      await db.query('UPDATE hero_slides SET order_index = -1 WHERE id = $1', [id]);
      await normalizeOrderIndexes();
      const newOrderIndex = await calculateOrderIndex(position, referenceSlideId);
      await db.query('UPDATE hero_slides SET order_index = $1 WHERE id = $2', [newOrderIndex, id]);
      await normalizeOrderIndexes();
    }

    const updatedResult = await db.query('SELECT * FROM hero_slides WHERE id = $1', [id]);
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
    const deleteResult = await db.query('DELETE FROM hero_slides WHERE id = $1 RETURNING *', [id]);

    if (deleteResult.rows.length === 0) {
      return res.status(404).json({ error: 'Slide not found' });
    }

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
