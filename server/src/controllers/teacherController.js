const { query } = require('../config/database');

// Get all teachers
const getAllTeachers = async (req, res) => {
  try {
    const result = await query(`
      SELECT
        t.id,
        t.class_id,
        t.subject_id,
        t.father_name,
        t.mother_name,
        t.marital_status,
        t.languages_known,
        t.blood_group,
        t.previous_school_name,
        t.previous_school_address,
        t.previous_school_phone,
        t.current_address,
        t.permanent_address,
        t.pan_number,
        t.id_number,
        t.bank_name,
        t.branch,
        t.ifsc,
        t.contract_type,
        t.shift,
        t.work_location,
        t.facebook,
        t.twitter,
        t.linkedin,
        t.status,
        t.created_at,
        t.updated_at,
        t.staff_id,
        s.employee_code,
        s.first_name,
        s.last_name,
        s.gender,
        s.date_of_birth,
        s.blood_group_id,
        s.phone,
        s.email,
        s.address,
        s.emergency_contact_name,
        s.emergency_contact_phone,
        s.designation_id,
        s.department_id,
        s.joining_date,
        s.salary,
        s.qualification,
        s.experience_years,
        s.photo_url,
        s.is_active,
        c.class_name,
        sub.subject_name
      FROM teachers t
      INNER JOIN staff s ON t.staff_id = s.id
      LEFT JOIN classes c ON t.class_id = c.id
      LEFT JOIN subjects sub ON t.subject_id = sub.id
      WHERE t.status = 'Active' AND s.is_active = true
      ORDER BY s.first_name ASC, s.last_name ASC
    `);
    
    res.status(200).json({
      status: 'SUCCESS',
      message: 'Teachers fetched successfully',
      data: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('Error fetching teachers:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Failed to fetch teachers',
    });
  }
};

// Get teacher by ID
const getTeacherById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await query(`
      SELECT
        t.id,
        t.class_id,
        t.subject_id,
        t.father_name,
        t.mother_name,
        t.marital_status,
        t.languages_known,
        t.blood_group,
        t.previous_school_name,
        t.previous_school_address,
        t.previous_school_phone,
        t.current_address,
        t.permanent_address,
        t.pan_number,
        t.id_number,
        t.bank_name,
        t.branch,
        t.ifsc,
        t.contract_type,
        t.shift,
        t.work_location,
        t.facebook,
        t.twitter,
        t.linkedin,
        t.status,
        t.created_at,
        t.updated_at,
        t.staff_id,
        s.employee_code,
        s.first_name,
        s.last_name,
        s.gender,
        s.date_of_birth,
        s.blood_group_id,
        s.phone,
        s.email,
        s.address,
        s.emergency_contact_name,
        s.emergency_contact_phone,
        s.designation_id,
        s.department_id,
        s.joining_date,
        s.salary,
        s.qualification,
        s.experience_years,
        s.photo_url,
        s.is_active,
        c.class_name,
        sub.subject_name
      FROM teachers t
      INNER JOIN staff s ON t.staff_id = s.id
      LEFT JOIN classes c ON t.class_id = c.id
      LEFT JOIN subjects sub ON t.subject_id = sub.id
      WHERE t.id = $1 AND t.status = 'Active' AND s.is_active = true
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'ERROR',
        message: 'Teacher not found'
      });
    }
    
    res.status(200).json({
      status: 'SUCCESS',
      message: 'Teacher fetched successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching teacher:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Failed to fetch teacher',
    });
  }
};

// Get teachers by class
const getTeachersByClass = async (req, res) => {
  try {
    const { classId } = req.params;
    
    const result = await query(`
      SELECT
        t.id,
        t.class_id,
        t.subject_id,
        t.father_name,
        t.mother_name,
        t.marital_status,
        t.languages_known,
        t.blood_group,
        t.previous_school_name,
        t.previous_school_address,
        t.previous_school_phone,
        t.current_address,
        t.permanent_address,
        t.pan_number,
        t.id_number,
        t.bank_name,
        t.branch,
        t.ifsc,
        t.contract_type,
        t.shift,
        t.work_location,
        t.facebook,
        t.twitter,
        t.linkedin,
        t.status,
        t.created_at,
        t.updated_at,
        t.staff_id,
        s.employee_code,
        s.first_name,
        s.last_name,
        s.gender,
        s.date_of_birth,
        s.blood_group_id,
        s.phone,
        s.email,
        s.address,
        s.emergency_contact_name,
        s.emergency_contact_phone,
        s.designation_id,
        s.department_id,
        s.joining_date,
        s.salary,
        s.qualification,
        s.experience_years,
        s.photo_url,
        s.is_active,
        c.class_name,
        sub.subject_name
      FROM teachers t
      INNER JOIN staff s ON t.staff_id = s.id
      LEFT JOIN classes c ON t.class_id = c.id
      LEFT JOIN subjects sub ON t.subject_id = sub.id
      WHERE t.class_id = $1 AND t.status = 'Active' AND s.is_active = true
      ORDER BY s.first_name ASC, s.last_name ASC
    `, [classId]);
    
    res.status(200).json({
      status: 'SUCCESS',
      message: 'Teachers fetched successfully',
      data: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('Error fetching teachers by class:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Failed to fetch teachers',
    });
  }
};

module.exports = {
  getAllTeachers,
  getTeacherById,
  getTeachersByClass
};
