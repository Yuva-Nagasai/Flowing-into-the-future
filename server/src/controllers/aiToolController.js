const { queryWithRetry } = require('../config/db');

const getAllAITools = async (req, res) => {
  try {
    const { category, active, pricing_type } = req.query;
    
    let query = 'SELECT * FROM ai_tools WHERE 1=1';
    const params = [];
    let paramCount = 1;

    if (active !== undefined) {
      query += ` AND active = $${paramCount}`;
      params.push(active === 'true');
      paramCount++;
    }

    if (category) {
      query += ` AND category = $${paramCount}`;
      params.push(category);
      paramCount++;
    }

    if (pricing_type) {
      query += ` AND pricing_type = $${paramCount}`;
      params.push(pricing_type);
      paramCount++;
    }

    query += ' ORDER BY created_at DESC';

    const result = await queryWithRetry(query, params);
    res.json({ tools: result.rows });
  } catch (error) {
    console.error('Get AI tools error:', error.message || error);
    // Return empty array instead of error to prevent frontend crashes
    res.json({ tools: [] });
  }
};

const getAIToolById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await queryWithRetry('SELECT * FROM ai_tools WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'AI tool not found' });
    }

    res.json({ tool: result.rows[0] });
  } catch (error) {
    console.error('Get AI tool error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const createAITool = async (req, res) => {
  try {
    const { name, description, category, color, features, pricing_type, url } = req.body;

    if (!name || !description || !category || !color || !features || !pricing_type || !url) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (!['free', 'paid'].includes(pricing_type)) {
      return res.status(400).json({ error: 'pricing_type must be either "free" or "paid"' });
    }

    if (!Array.isArray(features) || features.length === 0) {
      return res.status(400).json({ error: 'Features must be a non-empty array' });
    }

    const result = await queryWithRetry(
      `INSERT INTO ai_tools (name, description, category, color, features, pricing_type, url)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [name, description, category, color, features, pricing_type, url]
    );

    res.status(201).json({ tool: result.rows[0] });
  } catch (error) {
    console.error('Create AI tool error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const updateAITool = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, category, color, features, pricing_type, url, active } = req.body;

    const updateFields = [];
    const params = [];
    let paramCount = 1;

    if (name !== undefined) {
      updateFields.push(`name = $${paramCount}`);
      params.push(name);
      paramCount++;
    }
    if (description !== undefined) {
      updateFields.push(`description = $${paramCount}`);
      params.push(description);
      paramCount++;
    }
    if (category !== undefined) {
      updateFields.push(`category = $${paramCount}`);
      params.push(category);
      paramCount++;
    }
    if (color !== undefined) {
      updateFields.push(`color = $${paramCount}`);
      params.push(color);
      paramCount++;
    }
    if (features !== undefined) {
      if (!Array.isArray(features) || features.length === 0) {
        return res.status(400).json({ error: 'Features must be a non-empty array' });
      }
      updateFields.push(`features = $${paramCount}`);
      params.push(features);
      paramCount++;
    }
    if (pricing_type !== undefined) {
      if (!['free', 'paid'].includes(pricing_type)) {
        return res.status(400).json({ error: 'pricing_type must be either "free" or "paid"' });
      }
      updateFields.push(`pricing_type = $${paramCount}`);
      params.push(pricing_type);
      paramCount++;
    }
    if (url !== undefined) {
      updateFields.push(`url = $${paramCount}`);
      params.push(url);
      paramCount++;
    }
    if (active !== undefined) {
      updateFields.push(`active = $${paramCount}`);
      params.push(active);
      paramCount++;
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    updateFields.push(`updated_at = NOW()`);
    params.push(id);

    const result = await queryWithRetry(
      `UPDATE ai_tools SET ${updateFields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      params
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'AI tool not found' });
    }

    res.json({ tool: result.rows[0] });
  } catch (error) {
    console.error('Update AI tool error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const deleteAITool = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await queryWithRetry('DELETE FROM ai_tools WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'AI tool not found' });
    }

    res.json({ message: 'AI tool deleted successfully' });
  } catch (error) {
    console.error('Delete AI tool error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  getAllAITools,
  getAIToolById,
  createAITool,
  updateAITool,
  deleteAITool
};

