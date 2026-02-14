const { query } = require('../config/database');

// Get all subjects
const getAllSubjects = async (req, res) => {
  try {
    const result = await query(`
      SELECT
        s.id,
        s.subject_name,
        s.subject_code,
        s.class_id,
        s.teacher_id,
        s.theory_hours,
        s.practical_hours,
        s.total_marks,
        s.passing_marks,
        s.description,
        s.is_active,
        s.created_at
      FROM subjects s
      WHERE s.is_active = true
      ORDER BY s.subject_name ASC
    `);
    
    res.status(200).json({
      status: 'SUCCESS',
      message: 'Subjects fetched successfully',
      data: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('Error fetching subjects:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Failed to fetch subjects',
    });
  }
};

// Get subject by ID
const getSubjectById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await query(`
      SELECT
        s.id,
        s.subject_name,
        s.subject_code,
        s.class_id,
        s.teacher_id,
        s.theory_hours,
        s.practical_hours,
        s.total_marks,
        s.passing_marks,
        s.description,
        s.is_active,
        s.created_at
      FROM subjects s
      WHERE s.id = $1 AND s.is_active = true
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'ERROR',
        message: 'Subject not found'
      });
    }
    
    res.status(200).json({
      status: 'SUCCESS',
      message: 'Subject fetched successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching subject:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Failed to fetch subject',
    });
  }
};

// Get subjects by class
const getSubjectsByClass = async (req, res) => {
  try {
    const { classId } = req.params;
    
    const result = await query(`
      SELECT
        s.id,
        s.subject_name,
        s.subject_code,
        s.class_id,
        s.teacher_id,
        s.theory_hours,
        s.practical_hours,
        s.total_marks,
        s.passing_marks,
        s.description,
        s.is_active,
        s.created_at
      FROM subjects s
      WHERE s.class_id = $1 AND s.is_active = true
      ORDER BY s.subject_name ASC
    `, [classId]);
    
    res.status(200).json({
      status: 'SUCCESS',
      message: 'Subjects fetched successfully',
      data: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('Error fetching subjects by class:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Failed to fetch subjects',
    });
  }
};

module.exports = {
  getAllSubjects,
  getSubjectById,
  getSubjectsByClass
};
