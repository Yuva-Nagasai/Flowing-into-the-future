const pool = require('../config/db');

const fallbackSections = [
  {
    id: 'fallback-mission',
    section_type: 'mission',
    title: 'Our Mission',
    content:
      'We design AI-native experiences that help universities, enterprises, and fast-growing teams reimagine how they learn, operate, and collaborate.',
    icon_name: 'Target',
    active: true,
    images: [
      {
        image_url: '/image1.png',
        title: 'Responsible AI Labs',
        description: 'Building explainable, bias-tested learning copilots.'
      },
      {
        image_url: '/image4.png',
        title: 'Immersive Onboarding',
        description: 'Adaptive journeys that personalize every learner touchpoint.'
      }
    ]
  },
  {
    id: 'fallback-team',
    section_type: 'team',
    title: 'Our Team',
    content:
      'A 200+ person collective of learning scientists, cloud architects, storytellers, and data engineers distributed across four continents and united by an obsession with elegant problem solving.',
    icon_name: 'Users',
    active: true,
    team_members: [
      {
        name: 'Maya Patel',
        role: 'Chief AI Scientist',
        image_url: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39',
        portfolio_url: 'https://www.linkedin.com'
      },
      {
        name: 'Lucas Wright',
        role: 'VP, Learning Experience',
        image_url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1',
        portfolio_url: 'https://www.behance.net'
      },
      {
        name: 'Jiwoo Han',
        role: 'Head of Platform Engineering',
        image_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2',
        portfolio_url: 'https://github.com'
      }
    ]
  },
  {
    id: 'fallback-vision',
    section_type: 'vision',
    title: 'Our Vision',
    content:
      'To become the most trusted partner for lifelong learning, where every learner has a personalized mentor and every organization can prove the ROI of its knowledge investments.',
    icon_name: 'Rocket',
    active: true,
    images: [
      {
        image_url: '/image7.png',
        title: 'NanoFlows Campus',
        description: 'Always-on simulations that mirror the real workplace.'
      },
      {
        image_url: '/image6.png',
        title: 'Autonomous Delivery',
        description: 'Pipelines that turn research into shipped features weekly.'
      }
    ]
  },
  {
    id: 'fallback-growth',
    section_type: 'growth',
    title: 'Our Growth',
    content:
      'What started as a 5-person studio in 2018 now powers 60+ enterprise academies, 1.4M monthly learners, and a partner network across EdTech, finance, manufacturing, and healthcare.',
    icon_name: 'TrendingUp',
    active: true,
    images: [
      {
        image_url: '/image3.png',
        title: 'Global Delivery Pods',
        description: 'Follow-the-sun execution with pods in Austin, London, and Bengaluru.'
      },
      {
        image_url: '/image5.png',
        title: 'Impact Dashboards',
        description: 'Live ROI reporting that correlates talent, revenue, and retention.'
      }
    ]
  },
  {
    id: 'fallback-clients',
    section_type: 'clients',
    title: 'Our Clients',
    content:
      'We co-create with future-facing universities, unicorns, and Fortune 500 teams that treat learning as a competitive advantage.',
    icon_name: 'Handshake',
    active: true,
    company_logos: [
      {
        company_name: 'Apex Motors',
        logo_url: '/case1.jpg',
        industry: 'Autonomous Mobility',
        icon_name: 'Building2'
      },
      {
        company_name: 'Helix Bank',
        logo_url: '/case4.jpg',
        industry: 'FinTech Infrastructure',
        icon_name: 'Briefcase'
      },
      {
        company_name: 'Northstar Health',
        logo_url: '/case6.jpg',
        industry: 'Healthcare AI',
        icon_name: 'Shield'
      },
      {
        company_name: 'Orbital University',
        logo_url: '/case3.jpg',
        industry: 'Higher Education',
        icon_name: 'Globe'
      }
    ]
  }
];

// Get all about sections (public) – currently serves static fallback content
// This avoids database errors in development if the about_* tables aren’t migrated/seeded.
const getAllAboutSections = async (req, res) => {
  try {
    return res.status(200).json({ sections: fallbackSections, fallback: true });
  } catch (error) {
    console.error('Unexpected error in getAllAboutSections:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};

// Get all about sections (admin - includes inactive)
const getAllAboutSectionsAdmin = async (req, res) => {
  try {
    const sectionsResult = await pool.query(
      'SELECT * FROM about_sections ORDER BY order_index ASC'
    );

    const sections = sectionsResult.rows;

    // Fetch images, team members, and company logos for each section
    for (const section of sections) {
      const imagesResult = await pool.query(
        'SELECT * FROM about_section_images WHERE section_id = ? ORDER BY order_index ASC',
        [section.id]
      );
      section.images = imagesResult.rows;

      if (section.section_type === 'team') {
        const teamResult = await pool.query(
          'SELECT * FROM about_team_members WHERE section_id = ? ORDER BY order_index ASC',
          [section.id]
        );
        section.team_members = teamResult.rows;
      }

      if (section.section_type === 'clients') {
        const logosResult = await pool.query(
          'SELECT * FROM about_company_logos WHERE section_id = ? ORDER BY order_index ASC',
          [section.id]
        );
        section.company_logos = logosResult.rows;
      }
    }

    res.json({ sections });
  } catch (error) {
    console.error('Get about sections admin error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get single section by type
const getAboutSectionByType = async (req, res) => {
  try {
    const { type } = req.params;
    const result = await pool.query(
      'SELECT * FROM about_sections WHERE section_type = ? AND active = true',
      [type]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Section not found' });
    }

    const section = result.rows[0];

    // Fetch related data
    const imagesResult = await pool.query(
      'SELECT * FROM about_section_images WHERE section_id = ? ORDER BY order_index ASC',
      [section.id]
    );
    section.images = imagesResult.rows;

    if (section.section_type === 'team') {
      const teamResult = await pool.query(
        'SELECT * FROM about_team_members WHERE section_id = ? ORDER BY order_index ASC',
        [section.id]
      );
      section.team_members = teamResult.rows;
    }

    if (section.section_type === 'clients') {
      const logosResult = await pool.query(
        'SELECT * FROM about_company_logos WHERE section_id = ? ORDER BY order_index ASC',
        [section.id]
      );
      section.company_logos = logosResult.rows;
    }

    res.json({ section });
  } catch (error) {
    console.error('Get about section error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Create or update about section
const upsertAboutSection = async (req, res) => {
  try {
    const { section_type, title, content, icon_name, order_index, active, images, team_members, company_logos } = req.body;

    if (!section_type || !title || !content) {
      return res.status(400).json({ error: 'Section type, title, and content are required' });
    }

    // Check if section exists
    const existingResult = await pool.query(
      'SELECT id FROM about_sections WHERE section_type = ?',
      [section_type]
    );

    let sectionId;
    let section;

    if (existingResult.rows.length > 0) {
      // Update existing section
      sectionId = existingResult.rows[0].id;
      const updateResult = await pool.query(
        `UPDATE about_sections 
         SET title = ?, content = ?, icon_name = ?, order_index = ?, active = ?, updated_at = NOW()
         WHERE id = ?
         RETURNING *`,
        [title, content, icon_name || null, order_index || 0, active !== undefined ? active : true, sectionId]
      );
      section = updateResult.rows[0];
    } else {
      // Create new section
      const insertResult = await pool.query(
        `INSERT INTO about_sections (section_type, title, content, icon_name, order_index, active)
         VALUES (?, ?, ?, ?, ?, ?)
         RETURNING *`,
        [section_type, title, content, icon_name || null, order_index || 0, active !== undefined ? active : true]
      );
      section = insertResult.rows[0];
      sectionId = section.id;
    }

    // Handle images - always process for sections that use images (mission, vision, growth)
    if (['mission', 'vision', 'growth'].includes(section_type)) {
      // Always delete existing images first
      await pool.query('DELETE FROM about_section_images WHERE section_id = ?', [sectionId]);
      
      // Insert new images if provided
      if (images && Array.isArray(images) && images.length > 0) {
        for (let i = 0; i < images.length; i++) {
          const img = images[i];
          if (img.image_url || img.url) {
            await pool.query(
              `INSERT INTO about_section_images (section_id, image_url, title, description, image_type, order_index)
               VALUES (?, ?, ?, ?, ?, ?)`,
              [sectionId, img.image_url || img.url, img.title || null, img.description || null, section_type, i]
            );
          }
        }
      }
    }

    // Handle team members - always process for team section
    if (section_type === 'team') {
      // Always delete existing team members first
      await pool.query('DELETE FROM about_team_members WHERE section_id = ?', [sectionId]);
      
      // Insert new team members if provided
      if (team_members && Array.isArray(team_members) && team_members.length > 0) {
        for (let i = 0; i < team_members.length; i++) {
          const member = team_members[i];
          // Only insert if member has required fields
          if (member.name && member.role && (member.image_url || member.url)) {
            await pool.query(
              `INSERT INTO about_team_members (section_id, name, role, image_url, portfolio_url, order_index)
               VALUES (?, ?, ?, ?, ?, ?)`,
              [sectionId, member.name, member.role, member.image_url || member.url, member.portfolio_url || member.portfolio || '#', i]
            );
          }
        }
      }
    }

    // Handle company logos - always process for clients section
    if (section_type === 'clients') {
      // Always delete existing company logos first
      await pool.query('DELETE FROM about_company_logos WHERE section_id = ?', [sectionId]);
      
      // Insert new company logos if provided
      if (company_logos && Array.isArray(company_logos) && company_logos.length > 0) {
        for (let i = 0; i < company_logos.length; i++) {
          const logo = company_logos[i];
          // Only insert if logo has required fields
          if (logo.company_name || logo.name) {
            await pool.query(
              `INSERT INTO about_company_logos (section_id, company_name, logo_url, industry, icon_name, order_index)
               VALUES (?, ?, ?, ?, ?, ?)`,
              [sectionId, logo.company_name || logo.name, logo.logo_url || logo.logo || null, logo.industry || null, logo.icon_name || null, i]
            );
          }
        }
      }
    }

    // Fetch complete section data
    const completeResult = await pool.query('SELECT * FROM about_sections WHERE id = ?', [sectionId]);
    section = completeResult.rows[0];

    const imagesResult = await pool.query(
      'SELECT * FROM about_section_images WHERE section_id = ? ORDER BY order_index ASC',
      [sectionId]
    );
    section.images = imagesResult.rows;

    if (section.section_type === 'team') {
      const teamResult = await pool.query(
        'SELECT * FROM about_team_members WHERE section_id = ? ORDER BY order_index ASC',
        [sectionId]
      );
      section.team_members = teamResult.rows;
    }

    if (section.section_type === 'clients') {
      const logosResult = await pool.query(
        'SELECT * FROM about_company_logos WHERE section_id = ? ORDER BY order_index ASC',
        [sectionId]
      );
      section.company_logos = logosResult.rows;
    }

    res.json({ section });
  } catch (error) {
    console.error('Upsert about section error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete about section
const deleteAboutSection = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query('DELETE FROM about_sections WHERE id = ? RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Section not found' });
    }

    res.json({ message: 'Section deleted successfully' });
  } catch (error) {
    console.error('Delete about section error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  getAllAboutSections,
  getAllAboutSectionsAdmin,
  getAboutSectionByType,
  upsertAboutSection,
  deleteAboutSection
};

