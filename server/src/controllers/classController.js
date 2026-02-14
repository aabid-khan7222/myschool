const { query } = require('../config/database');

const getAllClasses = async (req, res) => {
  try {
    const result = await query(`
      SELECT
        c.id,
        c.class_name,
        c.class_code,
        c.academic_year_id,
        c.class_teacher_id,
        c.max_students,
        c.class_fee,
        c.description,
        c.is_active,
        c.created_at,
        c.no_of_students,
        ay.year_name as academic_year_name,
        s.first_name as teacher_first_name,
        s.last_name as teacher_last_name
      FROM classes c
      LEFT JOIN academic_years ay ON c.academic_year_id = ay.id
      LEFT JOIN staff s ON c.class_teacher_id = s.id
      WHERE c.is_active = true
      ORDER BY c.class_name ASC
    `);
    
    res.status(200).json({
      status: 'SUCCESS',
      message: 'Classes fetched successfully',
      data: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('Error fetching classes:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Failed to fetch classes',
    });
  }
};

const getClassById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query(`
      SELECT
        c.id,
        c.class_name,
        c.class_code,
        c.academic_year_id,
        c.class_teacher_id,
        c.max_students,
        c.class_fee,
        c.description,
        c.is_active,
        c.created_at,
        c.no_of_students,
        ay.year_name as academic_year_name,
        s.first_name as teacher_first_name,
        s.last_name as teacher_last_name
      FROM classes c
      LEFT JOIN academic_years ay ON c.academic_year_id = ay.id
      LEFT JOIN staff s ON c.class_teacher_id = s.id
      WHERE c.id = $1 AND c.is_active = true
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'ERROR',
        message: 'Class not found'
      });
    }

    res.status(200).json({
      status: 'SUCCESS',
      message: 'Class fetched successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching class:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Failed to fetch class',
    });
  }
};

const getClassesByAcademicYear = async (req, res) => {
  try {
    const { academicYearId } = req.params;
    const result = await query(`
      SELECT
        c.id,
        c.class_name,
        c.class_code,
        c.academic_year_id,
        c.class_teacher_id,
        c.max_students,
        c.class_fee,
        c.description,
        c.is_active,
        c.created_at,
        c.no_of_students,
        ay.year_name as academic_year_name,
        s.first_name as teacher_first_name,
        s.last_name as teacher_last_name
      FROM classes c
      LEFT JOIN academic_years ay ON c.academic_year_id = ay.id
      LEFT JOIN staff s ON c.class_teacher_id = s.id
      WHERE c.academic_year_id = $1 AND c.is_active = true
      ORDER BY c.class_name ASC
    `, [academicYearId]);

    res.status(200).json({
      status: 'SUCCESS',
      message: 'Classes fetched successfully',
      data: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('Error fetching classes by academic year:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Failed to fetch classes',
    });
  }
};

module.exports = {
  getAllClasses,
  getClassById,
  getClassesByAcademicYear
};
