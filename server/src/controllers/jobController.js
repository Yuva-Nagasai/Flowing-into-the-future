const { queryWithRetry } = require('../config/db');

const getAllJobs = async (req, res) => {
  try {
    const { department, active } = req.query;
    
    let query = 'SELECT * FROM jobs WHERE 1=1';
    const params = [];
    let paramCount = 1;

    if (active !== undefined) {
      query += ` AND active = $${paramCount}`;
      params.push(active === 'true');
      paramCount++;
    }

    if (department) {
      query += ` AND department = $${paramCount}`;
      params.push(department);
      paramCount++;
    }

    query += ' ORDER BY created_at DESC';

    const result = await queryWithRetry(query, params);
    res.json({ jobs: result.rows });
  } catch (error) {
    console.error('Get jobs error:', error.message || error);
    // Return empty array instead of error to prevent frontend crashes
    res.json({ jobs: [] });
  }
};

const getJobById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await queryWithRetry('SELECT * FROM jobs WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Job not found' });
    }

    res.json({ job: result.rows[0] });
  } catch (error) {
    console.error('Get job error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const createJob = async (req, res) => {
  try {
    const { title, department, location, type, description, requirements } = req.body;

    if (!title || !department || !location || !type || !description || !requirements) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (!Array.isArray(requirements) || requirements.length === 0) {
      return res.status(400).json({ error: 'Requirements must be a non-empty array' });
    }

    const result = await queryWithRetry(
      `INSERT INTO jobs (title, department, location, type, description, requirements)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [title, department, location, type, description, requirements]
    );

    res.status(201).json({ job: result.rows[0] });
  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, department, location, type, description, requirements, active } = req.body;

    const updateFields = [];
    const params = [];
    let paramCount = 1;

    if (title !== undefined) {
      updateFields.push(`title = $${paramCount}`);
      params.push(title);
      paramCount++;
    }
    if (department !== undefined) {
      updateFields.push(`department = $${paramCount}`);
      params.push(department);
      paramCount++;
    }
    if (location !== undefined) {
      updateFields.push(`location = $${paramCount}`);
      params.push(location);
      paramCount++;
    }
    if (type !== undefined) {
      updateFields.push(`type = $${paramCount}`);
      params.push(type);
      paramCount++;
    }
    if (description !== undefined) {
      updateFields.push(`description = $${paramCount}`);
      params.push(description);
      paramCount++;
    }
    if (requirements !== undefined) {
      if (!Array.isArray(requirements) || requirements.length === 0) {
        return res.status(400).json({ error: 'Requirements must be a non-empty array' });
      }
      updateFields.push(`requirements = $${paramCount}`);
      params.push(requirements);
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
      `UPDATE jobs SET ${updateFields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      params
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Job not found' });
    }

    res.json({ job: result.rows[0] });
  } catch (error) {
    console.error('Update job error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await queryWithRetry('DELETE FROM jobs WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Job not found' });
    }

    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob
};

