const { v4: uuidv4 } = require('uuid');
const { queryWithRetry } = require('../config/db');

const getAllAITools = async (req, res) => {
  try {
    const { category, active, pricing_type } = req.query;
    
    let query = 'SELECT * FROM ai_tools WHERE 1=1';
    const params = [];

    if (active !== undefined) {
      query += ' AND active = ?';
      params.push(active === 'true');
    }

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    if (pricing_type) {
      query += ' AND pricing_type = ?';
      params.push(pricing_type);
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
    const result = await queryWithRetry('SELECT * FROM ai_tools WHERE id = ?', [id]);

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

    const toolId = uuidv4();
    await queryWithRetry(
      `INSERT INTO ai_tools (id, name, description, category, color, features, pricing_type, url)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [toolId, name, description, category, color, features, pricing_type, url]
    );

    const result = await queryWithRetry('SELECT * FROM ai_tools WHERE id = ?', [toolId]);

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

    const existingTool = await queryWithRetry('SELECT * FROM ai_tools WHERE id = ?', [id]);
    if (existingTool.rows.length === 0) {
      return res.status(404).json({ error: 'AI tool not found' });
    }

    const updateFields = [];
    const params = [];

    if (name !== undefined) {
      updateFields.push('name = ?');
      params.push(name);
    }
    if (description !== undefined) {
      updateFields.push('description = ?');
      params.push(description);
    }
    if (category !== undefined) {
      updateFields.push('category = ?');
      params.push(category);
    }
    if (color !== undefined) {
      updateFields.push('color = ?');
      params.push(color);
    }
    if (features !== undefined) {
      if (!Array.isArray(features) || features.length === 0) {
        return res.status(400).json({ error: 'Features must be a non-empty array' });
      }
      updateFields.push('features = ?');
      params.push(features);
    }
    if (pricing_type !== undefined) {
      if (!['free', 'paid'].includes(pricing_type)) {
        return res.status(400).json({ error: 'pricing_type must be either "free" or "paid"' });
      }
      updateFields.push('pricing_type = ?');
      params.push(pricing_type);
    }
    if (url !== undefined) {
      updateFields.push('url = ?');
      params.push(url);
    }
    if (active !== undefined) {
      updateFields.push('active = ?');
      params.push(active);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    updateFields.push('updated_at = NOW()');
    params.push(id);

    await queryWithRetry(
      `UPDATE ai_tools SET ${updateFields.join(', ')} WHERE id = ?`,
      params
    );

    const updatedTool = await queryWithRetry('SELECT * FROM ai_tools WHERE id = ?', [id]);

    res.json({ tool: updatedTool.rows[0] });
  } catch (error) {
    console.error('Update AI tool error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const deleteAITool = async (req, res) => {
  try {
    const { id } = req.params;
    const existingTool = await queryWithRetry('SELECT * FROM ai_tools WHERE id = ?', [id]);
    if (existingTool.rows.length === 0) {
      return res.status(404).json({ error: 'AI tool not found' });
    }

    await queryWithRetry('DELETE FROM ai_tools WHERE id = ?', [id]);

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

