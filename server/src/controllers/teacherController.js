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

// Get teacher routine by teacher ID
const getTeacherRoutine = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Fetching routine for teacher ID:', id);
    
    // First verify teacher exists
    const teacherCheck = await query(`
      SELECT t.id, t.staff_id 
      FROM teachers t
      WHERE t.id = $1 AND t.status = 'Active'
    `, [id]);
    
    if (teacherCheck.rows.length === 0) {
      console.log('Teacher not found with ID:', id);
      return res.status(404).json({
        status: 'ERROR',
        message: 'Teacher not found'
      });
    }

    console.log('Teacher found, fetching schedules...');

    // First check what data exists for this teacher
    const checkQuery = await query(`SELECT COUNT(*) as count FROM class_schedules WHERE teacher_id = $1`, [id]);
    console.log(`Total schedules for teacher ${id}:`, checkQuery.rows[0].count);
    
    // Get a sample row to see column structure
    const sampleQuery = await query(`SELECT * FROM class_schedules WHERE teacher_id = $1 LIMIT 1`, [id]);
    if (sampleQuery.rows.length > 0) {
      console.log('Sample schedule row columns:', Object.keys(sampleQuery.rows[0]));
      console.log('Sample schedule row:', JSON.stringify(sampleQuery.rows[0], null, 2));
    }

    // Get class schedules for this teacher
    // Handle both 'slots' and 'time_slots' table names
    let schedulesQuery = `
      SELECT 
        cs.id,
        cs.class_id,
        cs.section_id,
        cs.subject_id,
        cs.time_slot_id,
        cs.day_of_week,
        cs.room_number,
        cs.teacher_id,
        cs.academic_year_id,
        c.class_name,
        sec.section_name,
        sub.subject_name,
        ts.slot_name,
        ts.start_time,
        ts.end_time,
        ts.duration,
        ts.is_break,
        ts.is_active
      FROM class_schedules cs
      LEFT JOIN classes c ON cs.class_id = c.id
      LEFT JOIN sections sec ON cs.section_id = sec.id
      LEFT JOIN subjects sub ON cs.subject_id = sub.id
      LEFT JOIN slots ts ON cs.time_slot_id = ts.id
      WHERE cs.teacher_id = $1
      ORDER BY 
        CASE cs.day_of_week
          WHEN 'Monday' THEN 1
          WHEN 'Tuesday' THEN 2
          WHEN 'Wednesday' THEN 3
          WHEN 'Thursday' THEN 4
          WHEN 'Friday' THEN 5
          WHEN 'Saturday' THEN 6
          WHEN 'Sunday' THEN 7
          WHEN 0 THEN 1
          WHEN 1 THEN 2
          WHEN 2 THEN 3
          WHEN 3 THEN 4
          WHEN 4 THEN 5
          WHEN 5 THEN 6
          WHEN 6 THEN 7
          ELSE 8
        END,
        ts.start_time ASC
    `;

    let schedulesResult;
    try {
      schedulesResult = await query(schedulesQuery, [id]);
      console.log('Schedules found:', schedulesResult.rows.length);
      if (schedulesResult.rows.length > 0) {
        console.log('First schedule:', JSON.stringify(schedulesResult.rows[0], null, 2));
      }
    } catch (e) {
      console.error('Error with slots table:', e.message);
      // Try with time_slots table if slots doesn't exist
      if (e.message.includes('slots') || e.message.includes('does not exist') || e.message.includes('relation')) {
        schedulesQuery = `
          SELECT 
            cs.id,
            cs.class_id,
            cs.section_id,
            cs.subject_id,
            cs.time_slot_id,
            cs.day_of_week,
            cs.room_number,
            cs.teacher_id,
            cs.academic_year_id,
            c.class_name,
            sec.section_name,
            sub.subject_name,
            ts.slot_name,
            ts.start_time,
            ts.end_time,
            ts.duration,
            ts.is_break,
            ts.is_active
          FROM class_schedules cs
          LEFT JOIN classes c ON cs.class_id = c.id
          LEFT JOIN sections sec ON cs.section_id = sec.id
          LEFT JOIN subjects sub ON cs.subject_id = sub.id
          LEFT JOIN time_slots ts ON cs.time_slot_id = ts.id
          WHERE cs.teacher_id = $1
          ORDER BY 
            CASE cs.day_of_week
              WHEN 'Monday' THEN 1
              WHEN 'Tuesday' THEN 2
              WHEN 'Wednesday' THEN 3
              WHEN 'Thursday' THEN 4
              WHEN 'Friday' THEN 5
              WHEN 'Saturday' THEN 6
              WHEN 'Sunday' THEN 7
              WHEN 0 THEN 1
              WHEN 1 THEN 2
              WHEN 2 THEN 3
              WHEN 3 THEN 4
              WHEN 4 THEN 5
              WHEN 5 THEN 6
              WHEN 6 THEN 7
              ELSE 8
            END,
            ts.start_time ASC
        `;
        schedulesResult = await query(schedulesQuery, [id]);
        console.log('Schedules found with time_slots:', schedulesResult.rows.length);
      } else {
        // If error is not about slots table, try without slot join
        console.log('Trying query without slot join...');
        schedulesQuery = `
          SELECT 
            cs.*,
            c.class_name,
            sec.section_name,
            sub.subject_name
          FROM class_schedules cs
          LEFT JOIN classes c ON cs.class_id = c.id
          LEFT JOIN sections sec ON cs.section_id = sec.id
          LEFT JOIN subjects sub ON cs.subject_id = sub.id
          WHERE cs.teacher_id = $1
        `;
        schedulesResult = await query(schedulesQuery, [id]);
        console.log('Schedules found without slot join:', schedulesResult.rows.length);
      }
    }

    // Get break/lunch times from slots table
    let breaksQuery = `
      SELECT 
        slot_name,
        start_time,
        end_time,
        duration,
        is_break,
        is_active
      FROM slots
      WHERE is_break = true AND is_active = true
      ORDER BY start_time ASC
    `;

    let breaksResult;
    try {
      breaksResult = await query(breaksQuery);
    } catch (e) {
      // Try with time_slots table if slots doesn't exist
      if (e.message.includes('slots') || e.message.includes('does not exist')) {
        breaksQuery = `
          SELECT 
            slot_name,
            start_time,
            end_time,
            duration,
            is_break,
            is_active
          FROM time_slots
          WHERE is_break = true AND is_active = true
          ORDER BY start_time ASC
        `;
        breaksResult = await query(breaksQuery);
      } else {
        breaksResult = { rows: [] };
      }
    }

    // Helper function to convert day to text
    const getDayName = (day) => {
      if (!day && day !== 0) return 'Monday';
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      if (typeof day === 'number') {
        return dayNames[day] || 'Monday';
      }
      if (typeof day === 'string') {
        const dayLower = day.toLowerCase();
        if (dayLower.includes('monday')) return 'Monday';
        if (dayLower.includes('tuesday')) return 'Tuesday';
        if (dayLower.includes('wednesday')) return 'Wednesday';
        if (dayLower.includes('thursday')) return 'Thursday';
        if (dayLower.includes('friday')) return 'Friday';
        if (dayLower.includes('saturday')) return 'Saturday';
        if (dayLower.includes('sunday')) return 'Sunday';
        return day; // Return as is if already formatted
      }
      return 'Monday';
    };

    // Format the response
    const routine = schedulesResult.rows.map(row => {
      // Get day value from any possible column name
      const dayValue = row.day_of_week || row.day || row.weekday || 
                       row['day of week'] || row['dayOfWeek'];
      
      // Get time from slot join or from class_schedules directly
      const startTime = row.start_time || row.startTime || row.period_start;
      const endTime = row.end_time || row.endTime || row.period_end;
      
      return {
        id: row.id,
        classId: row.class_id,
        className: row.class_name || row.className || 'N/A',
        sectionId: row.section_id,
        sectionName: row.section_name || row.sectionName || 'N/A',
        subjectId: row.subject_id,
        subjectName: row.subject_name || row.subjectName || 'N/A',
        timeSlotId: row.time_slot_id || row.time_slot || row.timeSlotId,
        slotName: row.slot_name || row.slotName || '',
        dayOfWeek: getDayName(dayValue),
        roomNumber: row.room_number || row.roomNumber || row.room_number || 'N/A',
        startTime: startTime,
        endTime: endTime,
        duration: row.duration || '',
        isBreak: row.is_break || false,
        academicYearId: row.academic_year_id || row.academicYearId
      };
    });

    console.log('Formatted routine count:', routine.length);
    if (routine.length > 0) {
      console.log('Sample routine item:', JSON.stringify(routine[0], null, 2));
    } else {
      console.log('No routine items found. Checking if teacher_id matches...');
      // Check if there are any schedules at all
      const allSchedules = await query(`SELECT teacher_id, COUNT(*) as count FROM class_schedules GROUP BY teacher_id LIMIT 10`);
      console.log('Sample teacher_ids in class_schedules:', allSchedules.rows);
    }

    const breaks = breaksResult.rows.map(row => ({
      slotName: row.slot_name,
      startTime: row.start_time,
      endTime: row.end_time,
      duration: row.duration
    }));

    res.status(200).json({
      status: 'SUCCESS',
      message: 'Teacher routine fetched successfully',
      data: {
        routine,
        breaks,
        count: routine.length
      }
    });
  } catch (error) {
    console.error('Error fetching teacher routine:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Failed to fetch teacher routine',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  getAllTeachers,
  getTeacherById,
  getTeachersByClass,
  getTeacherRoutine
};
