const pool = require('../config/db');

// Get all about sections (public)
const getAllAboutSections = async (req, res) => {
  try {
    const sectionsResult = await pool.query(
      'SELECT * FROM about_sections WHERE active = true ORDER BY order_index ASC'
    );

    const sections = sectionsResult.rows;

    // Fetch images, team members, and company logos for each section
    for (const section of sections) {
      // Get images
      const imagesResult = await pool.query(
        'SELECT * FROM about_section_images WHERE section_id = $1 ORDER BY order_index ASC',
        [section.id]
      );
      section.images = imagesResult.rows;

      // Get team members if it's team section
      if (section.section_type === 'team') {
        const teamResult = await pool.query(
          'SELECT * FROM about_team_members WHERE section_id = $1 ORDER BY order_index ASC',
          [section.id]
        );
        section.team_members = teamResult.rows;
      }

      // Get company logos if it's clients section
      if (section.section_type === 'clients') {
        const logosResult = await pool.query(
          'SELECT * FROM about_company_logos WHERE section_id = $1 ORDER BY order_index ASC',
          [section.id]
        );
        section.company_logos = logosResult.rows;
      }
    }

    res.json({ sections });
  } catch (error) {
    console.error('Get about sections error:', error);
    res.status(500).json({ error: 'Server error' });
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
        'SELECT * FROM about_section_images WHERE section_id = $1 ORDER BY order_index ASC',
        [section.id]
      );
      section.images = imagesResult.rows;

      if (section.section_type === 'team') {
        const teamResult = await pool.query(
          'SELECT * FROM about_team_members WHERE section_id = $1 ORDER BY order_index ASC',
          [section.id]
        );
        section.team_members = teamResult.rows;
      }

      if (section.section_type === 'clients') {
        const logosResult = await pool.query(
          'SELECT * FROM about_company_logos WHERE section_id = $1 ORDER BY order_index ASC',
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
      'SELECT * FROM about_sections WHERE section_type = $1 AND active = true',
      [type]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Section not found' });
    }

    const section = result.rows[0];

    // Fetch related data
    const imagesResult = await pool.query(
      'SELECT * FROM about_section_images WHERE section_id = $1 ORDER BY order_index ASC',
      [section.id]
    );
    section.images = imagesResult.rows;

    if (section.section_type === 'team') {
      const teamResult = await pool.query(
        'SELECT * FROM about_team_members WHERE section_id = $1 ORDER BY order_index ASC',
        [section.id]
      );
      section.team_members = teamResult.rows;
    }

    if (section.section_type === 'clients') {
      const logosResult = await pool.query(
        'SELECT * FROM about_company_logos WHERE section_id = $1 ORDER BY order_index ASC',
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
      'SELECT id FROM about_sections WHERE section_type = $1',
      [section_type]
    );

    let sectionId;
    let section;

    if (existingResult.rows.length > 0) {
      // Update existing section
      sectionId = existingResult.rows[0].id;
      const updateResult = await pool.query(
        `UPDATE about_sections 
         SET title = $1, content = $2, icon_name = $3, order_index = $4, active = $5, updated_at = NOW()
         WHERE id = $6
         RETURNING *`,
        [title, content, icon_name || null, order_index || 0, active !== undefined ? active : true, sectionId]
      );
      section = updateResult.rows[0];
    } else {
      // Create new section
      const insertResult = await pool.query(
        `INSERT INTO about_sections (section_type, title, content, icon_name, order_index, active)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [section_type, title, content, icon_name || null, order_index || 0, active !== undefined ? active : true]
      );
      section = insertResult.rows[0];
      sectionId = section.id;
    }

    // Handle images - always process for sections that use images (mission, vision, growth)
    if (['mission', 'vision', 'growth'].includes(section_type)) {
      // Always delete existing images first
      await pool.query('DELETE FROM about_section_images WHERE section_id = $1', [sectionId]);
      
      // Insert new images if provided
      if (images && Array.isArray(images) && images.length > 0) {
        for (let i = 0; i < images.length; i++) {
          const img = images[i];
          if (img.image_url || img.url) {
            await pool.query(
              `INSERT INTO about_section_images (section_id, image_url, title, description, image_type, order_index)
               VALUES ($1, $2, $3, $4, $5, $6)`,
              [sectionId, img.image_url || img.url, img.title || null, img.description || null, section_type, i]
            );
          }
        }
      }
    }

    // Handle team members - always process for team section
    if (section_type === 'team') {
      // Always delete existing team members first
      await pool.query('DELETE FROM about_team_members WHERE section_id = $1', [sectionId]);
      
      // Insert new team members if provided
      if (team_members && Array.isArray(team_members) && team_members.length > 0) {
        for (let i = 0; i < team_members.length; i++) {
          const member = team_members[i];
          // Only insert if member has required fields
          if (member.name && member.role && (member.image_url || member.url)) {
            await pool.query(
              `INSERT INTO about_team_members (section_id, name, role, image_url, portfolio_url, order_index)
               VALUES ($1, $2, $3, $4, $5, $6)`,
              [sectionId, member.name, member.role, member.image_url || member.url, member.portfolio_url || member.portfolio || '#', i]
            );
          }
        }
      }
    }

    // Handle company logos - always process for clients section
    if (section_type === 'clients') {
      // Always delete existing company logos first
      await pool.query('DELETE FROM about_company_logos WHERE section_id = $1', [sectionId]);
      
      // Insert new company logos if provided
      if (company_logos && Array.isArray(company_logos) && company_logos.length > 0) {
        for (let i = 0; i < company_logos.length; i++) {
          const logo = company_logos[i];
          // Only insert if logo has required fields
          if (logo.company_name || logo.name) {
            await pool.query(
              `INSERT INTO about_company_logos (section_id, company_name, logo_url, industry, icon_name, order_index)
               VALUES ($1, $2, $3, $4, $5, $6)`,
              [sectionId, logo.company_name || logo.name, logo.logo_url || logo.logo || null, logo.industry || null, logo.icon_name || null, i]
            );
          }
        }
      }
    }

    // Fetch complete section data
    const completeResult = await pool.query('SELECT * FROM about_sections WHERE id = $1', [sectionId]);
    section = completeResult.rows[0];

    const imagesResult = await pool.query(
      'SELECT * FROM about_section_images WHERE section_id = $1 ORDER BY order_index ASC',
      [sectionId]
    );
    section.images = imagesResult.rows;

    if (section.section_type === 'team') {
      const teamResult = await pool.query(
        'SELECT * FROM about_team_members WHERE section_id = $1 ORDER BY order_index ASC',
        [sectionId]
      );
      section.team_members = teamResult.rows;
    }

    if (section.section_type === 'clients') {
      const logosResult = await pool.query(
        'SELECT * FROM about_company_logos WHERE section_id = $1 ORDER BY order_index ASC',
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
    
    const result = await pool.query('DELETE FROM about_sections WHERE id = $1 RETURNING *', [id]);
    
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

