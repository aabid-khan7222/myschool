const { query } = require('../config/database');
const { parsePagination } = require('../utils/pagination');

// Create new parent
const createParent = async (req, res) => {
  try {
    const {
      student_id, father_name, father_email, father_phone, father_occupation, father_image_url,
      mother_name, mother_email, mother_phone, mother_occupation, mother_image_url
    } = req.body;

    // Validate required fields
    if (!student_id) {
      return res.status(400).json({
        status: 'ERROR',
        message: 'Student ID is required'
      });
    }

    // Check if parent already exists for this student
    const existingParent = await query(
      'SELECT id FROM parents WHERE student_id = $1',
      [student_id]
    );

    if (existingParent.rows.length > 0) {
      return res.status(400).json({
        status: 'ERROR',
        message: 'Parent record already exists for this student'
      });
    }

    const result = await query(`
      INSERT INTO parents (
        student_id, father_name, father_email, father_phone, father_occupation, father_image_url,
        mother_name, mother_email, mother_phone, mother_occupation, mother_image_url,
        created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW())
      RETURNING *
    `, [
      student_id, father_name || null, father_email || null, father_phone || null, 
      father_occupation || null, father_image_url || null, mother_name || null, 
      mother_email || null, mother_phone || null, mother_occupation || null, 
      mother_image_url || null
    ]);

    res.status(201).json({
      status: 'SUCCESS',
      message: 'Parent created successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating parent:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Failed to create parent',
    });
  }
};

// Update parent
const updateParent = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      father_name, father_email, father_phone, father_occupation, father_image_url,
      mother_name, mother_email, mother_phone, mother_occupation, mother_image_url
    } = req.body;

    const result = await query(`
      UPDATE parents SET
        father_name = $1,
        father_email = $2,
        father_phone = $3,
        father_occupation = $4,
        father_image_url = $5,
        mother_name = $6,
        mother_email = $7,
        mother_phone = $8,
        mother_occupation = $9,
        mother_image_url = $10,
        updated_at = NOW()
      WHERE id = $11
      RETURNING *
    `, [
      father_name || null, father_email || null, father_phone || null, 
      father_occupation || null, father_image_url || null, mother_name || null, 
      mother_email || null, mother_phone || null, mother_occupation || null, 
      mother_image_url || null, id
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'ERROR',
        message: 'Parent not found'
      });
    }

    res.status(200).json({
      status: 'SUCCESS',
      message: 'Parent updated successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating parent:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Failed to update parent',
    });
  }
};

// Get parents for current logged-in user (Parent role)
// Matches by user email/phone with father_email, mother_email, father_phone, mother_phone
const getMyParents = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        status: 'ERROR',
        message: 'Not authenticated'
      });
    }

    const userResult = await query(
      'SELECT email, phone FROM users WHERE id = $1 AND is_active = true',
      [userId]
    );
    if (userResult.rows.length === 0) {
      return res.status(404).json({
        status: 'ERROR',
        message: 'User not found'
      });
    }
    const user = userResult.rows[0];
    const userEmail = (user.email || '').toString().trim();
    const userPhone = (user.phone || '').toString().trim();

    if (!userEmail && !userPhone) {
      return res.status(200).json({
        status: 'SUCCESS',
        message: 'Parents fetched successfully',
        data: [],
        count: 0,
        pagination: { page: 1, limit: 100, total: 0, totalPages: 0 }
      });
    }

    const result = await query(`
      SELECT
        p.id,
        p.student_id,
        p.father_name,
        p.father_email,
        p.father_phone,
        p.father_occupation,
        p.father_image_url,
        p.mother_name,
        p.mother_email,
        p.mother_phone,
        p.mother_occupation,
        p.mother_image_url,
        p.created_at,
        p.updated_at,
        s.first_name as student_first_name,
        s.last_name as student_last_name,
        s.admission_number,
        s.roll_number,
        c.class_name,
        sec.section_name
      FROM parents p
      LEFT JOIN students s ON p.student_id = s.id
      LEFT JOIN classes c ON s.class_id = c.id
      LEFT JOIN sections sec ON s.section_id = sec.id
      WHERE s.is_active = true
        AND (
          (LOWER(TRIM(p.father_email)) = LOWER($1) AND $1 != '')
          OR (LOWER(TRIM(p.mother_email)) = LOWER($1) AND $1 != '')
          OR (TRIM(p.father_phone) = $2 AND $2 != '')
          OR (TRIM(p.mother_phone) = $2 AND $2 != '')
        )
      ORDER BY s.first_name ASC, s.last_name ASC
    `, [userEmail, userPhone]);

    res.status(200).json({
      status: 'SUCCESS',
      message: 'Parents fetched successfully',
      data: result.rows,
      count: result.rows.length,
      pagination: { page: 1, limit: result.rows.length, total: result.rows.length, totalPages: 1 }
    });
  } catch (error) {
    console.error('Error fetching my parents:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Failed to fetch parents',
    });
  }
};

// Get all parents
const getAllParents = async (req, res) => {
  try {
    const { page, limit, offset } = parsePagination(req.query);

    const countResult = await query(`
      SELECT COUNT(*)::int as total
      FROM parents p
      LEFT JOIN students s ON p.student_id = s.id
      WHERE s.is_active = true
    `);
    const total = countResult.rows[0].total;

    const result = await query(`
      SELECT
        p.id,
        p.student_id,
        p.father_name,
        p.father_email,
        p.father_phone,
        p.father_occupation,
        p.father_image_url,
        p.mother_name,
        p.mother_email,
        p.mother_phone,
        p.mother_occupation,
        p.mother_image_url,
        p.created_at,
        p.updated_at,
        s.first_name as student_first_name,
        s.last_name as student_last_name,
        s.admission_number,
        s.roll_number,
        c.class_name,
        sec.section_name
      FROM parents p
      LEFT JOIN students s ON p.student_id = s.id
      LEFT JOIN classes c ON s.class_id = c.id
      LEFT JOIN sections sec ON s.section_id = sec.id
      WHERE s.is_active = true
      ORDER BY s.first_name ASC, s.last_name ASC
      LIMIT $1 OFFSET $2
    `, [limit, offset]);
    
    res.status(200).json({
      status: 'SUCCESS',
      message: 'Parents fetched successfully',
      data: result.rows,
      count: result.rows.length,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
    });
  } catch (error) {
    console.error('Error fetching parents:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Failed to fetch parents',
    });
  }
};

// Get parent by ID
const getParentById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await query(`
      SELECT
        p.id,
        p.student_id,
        p.father_name,
        p.father_email,
        p.father_phone,
        p.father_occupation,
        p.father_image_url,
        p.mother_name,
        p.mother_email,
        p.mother_phone,
        p.mother_occupation,
        p.mother_image_url,
        p.created_at,
        p.updated_at,
        s.first_name as student_first_name,
        s.last_name as student_last_name,
        s.admission_number,
        s.roll_number,
        c.class_name,
        sec.section_name
      FROM parents p
      LEFT JOIN students s ON p.student_id = s.id
      LEFT JOIN classes c ON s.class_id = c.id
      LEFT JOIN sections sec ON s.section_id = sec.id
      WHERE p.id = $1 AND s.is_active = true
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'ERROR',
        message: 'Parent not found'
      });
    }
    
    res.status(200).json({
      status: 'SUCCESS',
      message: 'Parent fetched successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching parent:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Failed to fetch parent',
    });
  }
};

// Get parent by student ID
const getParentByStudentId = async (req, res) => {
  try {
    const { studentId } = req.params;
    
    const result = await query(`
      SELECT
        p.id,
        p.student_id,
        p.father_name,
        p.father_email,
        p.father_phone,
        p.father_occupation,
        p.father_image_url,
        p.mother_name,
        p.mother_email,
        p.mother_phone,
        p.mother_occupation,
        p.mother_image_url,
        p.created_at,
        p.updated_at,
        s.first_name as student_first_name,
        s.last_name as student_last_name,
        s.admission_number,
        s.roll_number,
        c.class_name,
        sec.section_name
      FROM parents p
      LEFT JOIN students s ON p.student_id = s.id
      LEFT JOIN classes c ON s.class_id = c.id
      LEFT JOIN sections sec ON s.section_id = sec.id
      WHERE p.student_id = $1 AND s.is_active = true
    `, [studentId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'ERROR',
        message: 'Parent not found for this student'
      });
    }
    
    res.status(200).json({
      status: 'SUCCESS',
      message: 'Parent fetched successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching parent by student ID:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Failed to fetch parent',
    });
  }
};

module.exports = {
  createParent,
  updateParent,
  getAllParents,
  getMyParents,
  getParentById,
  getParentByStudentId
};
