const { query } = require('../config/database');

// Get all guardians
const getAllGuardians = async (req, res) => {
  try {
    const result = await query(`
      SELECT
        g.id,
        g.student_id,
        g.guardian_type,
        g.first_name,
        g.last_name,
        g.relation,
        g.occupation,
        g.phone,
        g.email,
        s.first_name as student_first_name,
        s.last_name as student_last_name,
        s.admission_number,
        s.roll_number,
        c.class_name,
        sec.section_name
      FROM guardians g
      LEFT JOIN students s ON g.student_id = s.id
      LEFT JOIN classes c ON s.class_id = c.id
      LEFT JOIN sections sec ON s.section_id = sec.id
      WHERE s.is_active = true
      ORDER BY s.first_name ASC, s.last_name ASC
    `);
    
    res.status(200).json({
      status: 'SUCCESS',
      message: 'Guardians fetched successfully',
      data: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('Error fetching guardians:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Failed to fetch guardians',
    });
  }
};

// Get guardian by ID
const getGuardianById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await query(`
      SELECT
        g.id,
        g.student_id,
        g.guardian_type,
        g.first_name,
        g.last_name,
        g.relation,
        g.occupation,
        g.phone,
        g.email,
        s.first_name as student_first_name,
        s.last_name as student_last_name,
        s.admission_number,
        s.roll_number,
        c.class_name,
        sec.section_name
      FROM guardians g
      LEFT JOIN students s ON g.student_id = s.id
      LEFT JOIN classes c ON s.class_id = c.id
      LEFT JOIN sections sec ON s.section_id = sec.id
      WHERE g.id = $1 AND s.is_active = true
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'ERROR',
        message: 'Guardian not found'
      });
    }
    
    res.status(200).json({
      status: 'SUCCESS',
      message: 'Guardian fetched successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching guardian:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Failed to fetch guardian',
    });
  }
};

// Get guardian by student ID
const getGuardianByStudentId = async (req, res) => {
  try {
    const { studentId } = req.params;
    
    const result = await query(`
      SELECT
        g.id,
        g.student_id,
        g.guardian_type,
        g.first_name,
        g.last_name,
        g.relation,
        g.occupation,
        g.phone,
        g.email,
        s.first_name as student_first_name,
        s.last_name as student_last_name,
        s.admission_number,
        s.roll_number,
        c.class_name,
        sec.section_name
      FROM guardians g
      LEFT JOIN students s ON g.student_id = s.id
      LEFT JOIN classes c ON s.class_id = c.id
      LEFT JOIN sections sec ON s.section_id = sec.id
      WHERE g.student_id = $1 AND s.is_active = true
    `, [studentId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'ERROR',
        message: 'Guardian not found for this student'
      });
    }
    
    res.status(200).json({
      status: 'SUCCESS',
      message: 'Guardian fetched successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching guardian by student ID:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Failed to fetch guardian',
    });
  }
};

module.exports = {
  getAllGuardians,
  getGuardianById,
  getGuardianByStudentId
};
