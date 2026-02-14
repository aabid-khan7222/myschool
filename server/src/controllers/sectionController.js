const { query } = require('../config/database');

const getAllSections = async (req, res) => {
  try {
    const result = await query(`
      SELECT
        s.id,
        s.section_name,
        s.class_id,
        s.section_teacher_id,
        s.max_students,
        s.room_number,
        s.description,
        s.is_active,
        s.created_at,
        s.no_of_students,
        c.class_name,
        c.class_code,
        st.first_name as teacher_first_name,
        st.last_name as teacher_last_name
      FROM sections s
      LEFT JOIN classes c ON s.class_id = c.id
      LEFT JOIN staff st ON s.section_teacher_id = st.id
      WHERE s.is_active = true
      ORDER BY c.class_name ASC, s.section_name ASC
    `);
    
    res.status(200).json({
      status: 'SUCCESS',
      message: 'Sections fetched successfully',
      data: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('Error fetching sections:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Failed to fetch sections',
    });
  }
};

const getSectionById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query(`
      SELECT
        s.id,
        s.section_name,
        s.class_id,
        s.section_teacher_id,
        s.max_students,
        s.room_number,
        s.description,
        s.is_active,
        s.created_at,
        s.no_of_students,
        c.class_name,
        c.class_code,
        st.first_name as teacher_first_name,
        st.last_name as teacher_last_name
      FROM sections s
      LEFT JOIN classes c ON s.class_id = c.id
      LEFT JOIN staff st ON s.section_teacher_id = st.id
      WHERE s.id = $1 AND s.is_active = true
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'ERROR',
        message: 'Section not found'
      });
    }

    res.status(200).json({
      status: 'SUCCESS',
      message: 'Section fetched successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching section:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Failed to fetch section',
    });
  }
};

const getSectionsByClass = async (req, res) => {
  try {
    const { classId } = req.params;
    const result = await query(`
      SELECT
        s.id,
        s.section_name,
        s.class_id,
        s.section_teacher_id,
        s.max_students,
        s.room_number,
        s.description,
        s.is_active,
        s.created_at,
        s.no_of_students,
        c.class_name,
        c.class_code,
        st.first_name as teacher_first_name,
        st.last_name as teacher_last_name
      FROM sections s
      LEFT JOIN classes c ON s.class_id = c.id
      LEFT JOIN staff st ON s.section_teacher_id = st.id
      WHERE s.class_id = $1 AND s.is_active = true
      ORDER BY s.section_name ASC
    `, [classId]);

    res.status(200).json({
      status: 'SUCCESS',
      message: 'Sections fetched successfully',
      data: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('Error fetching sections by class:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Failed to fetch sections',
    });
  }
};

module.exports = {
  getAllSections,
  getSectionById,
  getSectionsByClass
};
