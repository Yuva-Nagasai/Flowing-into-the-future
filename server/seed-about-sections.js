require('dotenv').config();
const pool = require('./src/config/db');

async function seedAboutSections() {
  try {
    console.log('🌱 Seeding about sections with default data...\n');

    // Mission Section
    console.log('📝 Creating Mission section...');
    const missionResult = await pool.query(
      `INSERT INTO about_sections (section_type, title, content, icon_name, order_index, active)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (section_type) DO UPDATE
       SET title = EXCLUDED.title, content = EXCLUDED.content, updated_at = NOW()
       RETURNING *`,
      [
        'mission',
        'Our Mission',
        'To empower businesses with cutting-edge AI technology that transforms digital experiences through seamless innovation and continuous evolution.',
        'Target',
        0,
        true
      ]
    );
    const missionId = missionResult.rows[0].id;

    // Mission Images
    const missionImages = [
      { url: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&h=400&fit=crop', title: 'Innovation', description: 'Driving technological advancement' },
      { url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop', title: 'Collaboration', description: 'Working together for success' },
      { url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop', title: 'Strategy', description: 'Planning for the future' },
      { url: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&h=400&fit=crop', title: 'Excellence', description: 'Commitment to quality' },
      { url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&h=400&fit=crop', title: 'Digital Transformation', description: 'Evolving with technology' },
    ];

    await pool.query('DELETE FROM about_section_images WHERE section_id = $1', [missionId]);
    for (let i = 0; i < missionImages.length; i++) {
      await pool.query(
        `INSERT INTO about_section_images (section_id, image_url, title, description, image_type, order_index)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [missionId, missionImages[i].url, missionImages[i].title, missionImages[i].description, 'mission', i]
      );
    }
    console.log(`✅ Mission section created with ${missionImages.length} images`);

    // Team Section
    console.log('📝 Creating Team section...');
    const teamResult = await pool.query(
      `INSERT INTO about_sections (section_type, title, content, icon_name, order_index, active)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (section_type) DO UPDATE
       SET title = EXCLUDED.title, content = EXCLUDED.content, updated_at = NOW()
       RETURNING *`,
      [
        'team',
        'Our Team',
        'A diverse collective of AI specialists, developers, designers, and innovators passionate about pushing the boundaries of technology.',
        'Users',
        1,
        true
      ]
    );
    const teamId = teamResult.rows[0].id;

    // Team Members
    const teamMembers = [
      { url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop', name: 'Sarah Chen', role: 'CEO & Founder', portfolio: '#' },
      { url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop', name: 'Marcus Johnson', role: 'CTO', portfolio: '#' },
      { url: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=400&fit=crop', name: 'Emily Rodriguez', role: 'Head of Design', portfolio: '#' },
      { url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop', name: 'David Kim', role: 'Lead Developer', portfolio: '#' },
      { url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop', name: 'Lisa Anderson', role: 'AI Specialist', portfolio: '#' },
      { url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop', name: 'James Wilson', role: 'Product Manager', portfolio: '#' },
    ];

    await pool.query('DELETE FROM about_team_members WHERE section_id = $1', [teamId]);
    for (let i = 0; i < teamMembers.length; i++) {
      await pool.query(
        `INSERT INTO about_team_members (section_id, name, role, image_url, portfolio_url, order_index)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [teamId, teamMembers[i].name, teamMembers[i].role, teamMembers[i].url, teamMembers[i].portfolio, i]
      );
    }
    console.log(`✅ Team section created with ${teamMembers.length} members`);

    // Vision Section
    console.log('📝 Creating Vision section...');
    const visionResult = await pool.query(
      `INSERT INTO about_sections (section_type, title, content, icon_name, order_index, active)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (section_type) DO UPDATE
       SET title = EXCLUDED.title, content = EXCLUDED.content, updated_at = NOW()
       RETURNING *`,
      [
        'vision',
        'Our Vision',
        'To lead the future of digital transformation by pioneering AI-powered personalization that adapts, learns, and evolves with every interaction.',
        'Rocket',
        2,
        true
      ]
    );
    const visionId = visionResult.rows[0].id;

    // Vision Images
    const visionImages = [
      { url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=400&fit=crop', title: 'AI Future', description: 'Leading AI innovation' },
      { url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&h=400&fit=crop', title: 'Smart Solutions', description: 'Intelligent technology' },
      { url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop', title: 'Global Reach', description: 'Worldwide impact' },
      { url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&h=400&fit=crop', title: 'Connected World', description: 'Seamless integration' },
      { url: 'https://images.unsplash.com/photo-1483058712412-4245e9b90334?w=600&h=400&fit=crop', title: 'Future Ready', description: 'Tomorrow\'s technology today' },
    ];

    await pool.query('DELETE FROM about_section_images WHERE section_id = $1', [visionId]);
    for (let i = 0; i < visionImages.length; i++) {
      await pool.query(
        `INSERT INTO about_section_images (section_id, image_url, title, description, image_type, order_index)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [visionId, visionImages[i].url, visionImages[i].title, visionImages[i].description, 'vision', i]
      );
    }
    console.log(`✅ Vision section created with ${visionImages.length} images`);

    // Growth Section
    console.log('📝 Creating Growth section...');
    const growthResult = await pool.query(
      `INSERT INTO about_sections (section_type, title, content, icon_name, order_index, active)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (section_type) DO UPDATE
       SET title = EXCLUDED.title, content = EXCLUDED.content, updated_at = NOW()
       RETURNING *`,
      [
        'growth',
        'Our Growth',
        'From startup to industry leader, our journey has been marked by continuous innovation and expansion across 150+ countries, serving 500+ clients worldwide.',
        'TrendingUp',
        3,
        true
      ]
    );
    const growthId = growthResult.rows[0].id;

    // Growth Milestones
    const growthMilestones = [
      { url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop', title: '2018 - Founded', description: 'Started with a vision' },
      { url: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600&h=400&fit=crop', title: '2019 - First 100 Clients', description: 'Rapid expansion' },
      { url: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&h=400&fit=crop', title: '2020 - Global Presence', description: 'Reached 50 countries' },
      { url: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=600&h=400&fit=crop', title: '2022 - Industry Leader', description: 'Market recognition' },
      { url: 'https://images.unsplash.com/photo-1523287562758-66c7fc58967f?w=600&h=400&fit=crop', title: '2024 - Innovation Award', description: 'Excellence recognized' },
    ];

    await pool.query('DELETE FROM about_section_images WHERE section_id = $1', [growthId]);
    for (let i = 0; i < growthMilestones.length; i++) {
      await pool.query(
        `INSERT INTO about_section_images (section_id, image_url, title, description, image_type, order_index)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [growthId, growthMilestones[i].url, growthMilestones[i].title, growthMilestones[i].description, 'growth', i]
      );
    }
    console.log(`✅ Growth section created with ${growthMilestones.length} milestones`);

    // Clients Section
    console.log('📝 Creating Clients section...');
    const clientsResult = await pool.query(
      `INSERT INTO about_sections (section_type, title, content, icon_name, order_index, active)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (section_type) DO UPDATE
       SET title = EXCLUDED.title, content = EXCLUDED.content, updated_at = NOW()
       RETURNING *`,
      [
        'clients',
        'Our Clients',
        'We partner with organizations worldwide, from startups to Fortune 500 companies, helping them transform their digital presence and achieve their goals through innovative technology solutions.',
        'Handshake',
        4,
        true
      ]
    );
    const clientsId = clientsResult.rows[0].id;

    // Client Images (separate from company logos)
    const clientImages = [
      { url: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=600&h=400&fit=crop', title: 'Global Partnerships', description: 'Trusted by leading enterprises worldwide' },
      { url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop', title: 'Client Success Stories', description: 'Transforming businesses across industries' },
      { url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop', title: 'Long-term Relationships', description: 'Building partnerships that last' },
      { url: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&h=400&fit=crop', title: 'Innovation Together', description: 'Collaborating for breakthrough solutions' },
      { url: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&h=400&fit=crop', title: 'Client-Centric Approach', description: 'Your success is our mission' },
    ];

    // Add client images to about_section_images
    await pool.query('DELETE FROM about_section_images WHERE section_id = $1 AND image_type = $2', [clientsId, 'clients']);
    for (let i = 0; i < clientImages.length; i++) {
      await pool.query(
        `INSERT INTO about_section_images (section_id, image_url, title, description, image_type, order_index)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [clientsId, clientImages[i].url, clientImages[i].title, clientImages[i].description, 'clients', i]
      );
    }
    console.log(`✅ Clients section created with ${clientImages.length} client images`);

    // Company Logos
    const companyLogos = [
      { name: 'TechCorp', logo: 'https://logo.clearbit.com/techcorp.com', industry: 'Technology', icon: 'Building2' },
      { name: 'InnovateLabs', logo: 'https://logo.clearbit.com/innovatelabs.com', industry: 'Innovation', icon: 'Zap' },
      { name: 'DigitalFlow', logo: 'https://logo.clearbit.com/digitalflow.com', industry: 'Digital Solutions', icon: 'Code' },
      { name: 'CloudSync', logo: 'https://logo.clearbit.com/cloudsync.com', industry: 'Cloud Services', icon: 'Cloud' },
      { name: 'DataVault', logo: 'https://logo.clearbit.com/datavault.com', industry: 'Data Analytics', icon: 'Database' },
      { name: 'SmartBiz', logo: 'https://logo.clearbit.com/smartbiz.com', industry: 'Business Intelligence', icon: 'Briefcase' },
      { name: 'FutureTech', logo: 'https://logo.clearbit.com/futuretech.com', industry: 'Emerging Tech', icon: 'Rocket' },
      { name: 'AISolutions', logo: 'https://logo.clearbit.com/aisolutions.com', industry: 'AI Services', icon: 'Brain' },
      { name: 'GlobalNet', logo: 'https://logo.clearbit.com/globalnet.com', industry: 'Networking', icon: 'Globe' },
      { name: 'EnterprisePlus', logo: 'https://logo.clearbit.com/enterpriseplus.com', industry: 'Enterprise', icon: 'Building2' },
      { name: 'NextGen', logo: 'https://logo.clearbit.com/nextgen.com', industry: 'Next Generation', icon: 'Cpu' },
      { name: 'QuantumLeap', logo: 'https://logo.clearbit.com/quantumleap.com', industry: 'Advanced Tech', icon: 'Shield' },
    ];

    await pool.query('DELETE FROM about_company_logos WHERE section_id = $1', [clientsId]);
    for (let i = 0; i < companyLogos.length; i++) {
      await pool.query(
        `INSERT INTO about_company_logos (section_id, company_name, logo_url, industry, icon_name, order_index)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [clientsId, companyLogos[i].name, companyLogos[i].logo, companyLogos[i].industry, companyLogos[i].icon, i]
      );
    }
    console.log(`✅ Clients section created with ${companyLogos.length} company logos`);

    console.log('\n✅ All about sections seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
}

seedAboutSections();

