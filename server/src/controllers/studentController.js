const { query, executeTransaction } = require('../config/database');
const { parsePagination } = require('../utils/pagination');

// Create new student
const createStudent = async (req, res) => {
  try {
    const {
      academic_year_id, admission_number, admission_date, roll_number, status,
      first_name, last_name, class_id, section_id, gender, date_of_birth,
      blood_group_id, house_id, religion_id, cast_id, phone, email, mother_tongue_id,
      // Parent fields
      father_name, father_email, father_phone, father_occupation, father_image_url,
      mother_name, mother_email, mother_phone, mother_occupation, mother_image_url
    } = req.body;

    // Validate required fields
    if (!admission_number || !first_name || !last_name) {
      return res.status(400).json({
        status: 'ERROR',
        message: 'Admission number, first name, and last name are required'
      });
    }

    const hasParentInfo = father_name || father_email || father_phone || father_occupation ||
                         mother_name || mother_email || mother_phone || mother_occupation;

    const student = await executeTransaction(async (client) => {
      const existingStudent = await client.query(
        'SELECT id FROM students WHERE admission_number = $1 AND is_active = true',
        [admission_number]
      );

      if (existingStudent.rows.length > 0) {
        const err = new Error('Student with this admission number already exists');
        err.statusCode = 400;
        throw err;
      }

      const result = await client.query(`
        INSERT INTO students (
          academic_year_id, admission_number, admission_date, roll_number,
          first_name, last_name, class_id, section_id, gender, date_of_birth,
          blood_group_id, house_id, religion_id, cast_id, phone, email,
          mother_tongue_id, is_active, created_at, modified_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, NOW(), NOW())
        RETURNING *
      `, [
        academic_year_id || null, admission_number, admission_date || null, roll_number || null,
        first_name, last_name, class_id || null, section_id || null, gender || null,
        date_of_birth || null, blood_group_id || null, house_id || null, religion_id || null,
        cast_id || null, phone || null, email || null, mother_tongue_id || null,
        status === 'Active' ? true : false
      ]);

      const studentRow = result.rows[0];

      if (hasParentInfo) {
        const parentResult = await client.query(`
          INSERT INTO parents (
            student_id, father_name, father_email, father_phone, father_occupation, father_image_url,
            mother_name, mother_email, mother_phone, mother_occupation, mother_image_url,
            created_at, updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW())
          RETURNING id
        `, [
          studentRow.id, father_name || null, father_email || null, father_phone || null,
          father_occupation || null, father_image_url || null, mother_name || null,
          mother_email || null, mother_phone || null, mother_occupation || null,
          mother_image_url || null
        ]);

        await client.query(`
          UPDATE students SET parent_id = $1, modified_at = NOW() WHERE id = $2
        `, [parentResult.rows[0].id, studentRow.id]);

        studentRow.parent_id = parentResult.rows[0].id;
      }

      return studentRow;
    });

    res.status(201).json({
      status: 'SUCCESS',
      message: 'Student created successfully',
      data: student
    });
  } catch (error) {
    console.error('Error creating student:', error);
    if (error.statusCode === 400) {
      return res.status(400).json({ status: 'ERROR', message: error.message });
    }
    res.status(500).json({
      status: 'ERROR',
      message: 'Failed to create student'
    });
  }
};

// Update student
const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      academic_year_id, admission_number, admission_date, roll_number, status,
      first_name, last_name, class_id, section_id, gender, date_of_birth,
      blood_group_id, house_id, religion_id, cast_id, phone, email, mother_tongue_id,
      // Parent fields
      father_name, father_email, father_phone, father_occupation, father_image_url,
      mother_name, mother_email, mother_phone, mother_occupation, mother_image_url
    } = req.body;

    // Validate required fields
    if (!admission_number || !first_name || !last_name) {
      return res.status(400).json({
        status: 'ERROR',
        message: 'Admission number, first name, and last name are required'
      });
    }

    const hasParentInfo = father_name || father_email || father_phone || father_occupation ||
                         mother_name || mother_email || mother_phone || mother_occupation;

    const student = await executeTransaction(async (client) => {
      const existingStudent = await client.query(
        'SELECT id FROM students WHERE admission_number = $1 AND id != $2 AND is_active = true',
        [admission_number, id]
      );

      if (existingStudent.rows.length > 0) {
        const err = new Error('Student with this admission number already exists');
        err.statusCode = 400;
        throw err;
      }

      const result = await client.query(`
        UPDATE students SET
          academic_year_id = $1,
          admission_number = $2,
          admission_date = $3,
          roll_number = $4,
          first_name = $5,
          last_name = $6,
          class_id = $7,
          section_id = $8,
          gender = $9,
          date_of_birth = $10,
          blood_group_id = $11,
          house_id = $12,
          religion_id = $13,
          cast_id = $14,
          phone = $15,
          email = $16,
          mother_tongue_id = $17,
          is_active = $18,
          modified_at = NOW()
        WHERE id = $19
        RETURNING *
      `, [
        academic_year_id || null, admission_number, admission_date || null, roll_number || null,
        first_name, last_name, class_id || null, section_id || null, gender || null,
        date_of_birth || null, blood_group_id || null, house_id || null, religion_id || null,
        cast_id || null, phone || null, email || null, mother_tongue_id || null,
        status === 'Active' ? true : false, id
      ]);

      if (result.rows.length === 0) {
        const err = new Error('Student not found');
        err.statusCode = 404;
        throw err;
      }

      const studentRow = result.rows[0];

      if (hasParentInfo) {
        const existingParent = await client.query(
          'SELECT id FROM parents WHERE student_id = $1',
          [studentRow.id]
        );

        if (existingParent.rows.length > 0) {
          await client.query(`
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
            WHERE student_id = $11
          `, [
            father_name || null, father_email || null, father_phone || null,
            father_occupation || null, father_image_url || null, mother_name || null,
            mother_email || null, mother_phone || null, mother_occupation || null,
            mother_image_url || null, studentRow.id
          ]);

          if (!studentRow.parent_id) {
            await client.query(`
              UPDATE students SET parent_id = $1, modified_at = NOW() WHERE id = $2
            `, [existingParent.rows[0].id, studentRow.id]);
            studentRow.parent_id = existingParent.rows[0].id;
          }
        } else {
          const parentResult = await client.query(`
            INSERT INTO parents (
              student_id, father_name, father_email, father_phone, father_occupation, father_image_url,
              mother_name, mother_email, mother_phone, mother_occupation, mother_image_url,
              created_at, updated_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW())
            RETURNING id
          `, [
            studentRow.id, father_name || null, father_email || null, father_phone || null,
            father_occupation || null, father_image_url || null, mother_name || null,
            mother_email || null, mother_phone || null, mother_occupation || null,
            mother_image_url || null
          ]);

          await client.query(`
            UPDATE students SET parent_id = $1, modified_at = NOW() WHERE id = $2
          `, [parentResult.rows[0].id, studentRow.id]);

          studentRow.parent_id = parentResult.rows[0].id;
        }
      }

      return studentRow;
    });

    res.status(200).json({
      status: 'SUCCESS',
      message: 'Student updated successfully',
      data: student
    });
  } catch (error) {
    console.error('Error updating student:', error);
    if (error.statusCode === 400) {
      return res.status(400).json({ status: 'ERROR', message: error.message });
    }
    if (error.statusCode === 404) {
      return res.status(404).json({ status: 'ERROR', message: error.message });
    }
    res.status(500).json({
      status: 'ERROR',
      message: 'Failed to update student'
    });
  }
};

// Get all students
const getAllStudents = async (req, res) => {
  try {
    const { page, limit, offset } = parsePagination(req.query);

    const countResult = await query(
      'SELECT COUNT(*)::int as total FROM students WHERE is_active = true'
    );
    const total = countResult.rows[0].total;

    const result = await query(`
      SELECT
        s.id,
        s.admission_number,
        s.roll_number,
        s.first_name,
        s.last_name,
        s.gender,
        s.date_of_birth,
        s.place_of_birth,
        s.blood_group_id,
        s.religion_id,
        s.cast_id,
        s.mother_tongue_id,
        s.nationality,
        s.phone,
        s.email,
        s.address,
        s.user_id,
        s.academic_year_id,
        s.class_id,
        s.section_id,
        s.house_id,
        s.admission_date,
        s.previous_school,
        s.photo_url,
        s.is_transport_required,
        s.route_id,
        s.pickup_point_id,
        s.is_hostel_required,
        s.hostel_room_id,
        s.parent_id,
        s.guardian_id,
        s.is_active,
        s.created_at,
        c.class_name,
        sec.section_name,
        p.father_name,
        p.father_email,
        p.father_phone,
        p.father_occupation,
        p.mother_name,
        p.mother_email,
        p.mother_phone,
        p.mother_occupation,
        g.first_name as guardian_first_name,
        g.last_name as guardian_last_name,
        g.phone as guardian_phone,
        g.email as guardian_email,
        g.occupation as guardian_occupation,
        g.relation as guardian_relation,
        addr.current_address,
        addr.permanent_address
      FROM students s
      LEFT JOIN classes c ON s.class_id = c.id
      LEFT JOIN sections sec ON s.section_id = sec.id
      LEFT JOIN parents p ON s.parent_id = p.id
      LEFT JOIN guardians g ON s.guardian_id = g.id
      LEFT JOIN addresses addr ON s.user_id = addr.user_id
      WHERE s.is_active = true
      ORDER BY s.first_name ASC, s.last_name ASC
      LIMIT $1 OFFSET $2
    `, [limit, offset]);
    
    res.status(200).json({
      status: 'SUCCESS',
      message: 'Students fetched successfully',
      data: result.rows,
      count: result.rows.length,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
    });
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Failed to fetch students'
    });
  }
};

// Get student by ID (with blood_group, religion, cast, mother_tongue names from lookup tables)
const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Fetching student with ID:', id);

    const baseSelect = `
      s.id, s.admission_number, s.roll_number, s.first_name, s.last_name,
      s.gender, s.date_of_birth, s.place_of_birth, s.blood_group_id, s.cast_id, s.mother_tongue_id,
      s.nationality, s.phone, s.email, s.address, s.user_id, s.academic_year_id,
      s.class_id, s.section_id, s.house_id, s.admission_date, s.previous_school,
      s.photo_url, s.is_transport_required, s.route_id, s.pickup_point_id,
      s.is_hostel_required, s.hostel_id, s.hostel_room_id, s.parent_id, s.guardian_id, s.is_active, s.created_at,
      s.sibiling_1, s.sibiling_2, s.sibiling_1_class, s.sibiling_2_class,
      c.class_name, sec.section_name,
      bg.blood_group as blood_group_name,
      cast_t.cast_name,
      mt.language_name as mother_tongue_name,
      p.father_name, p.father_email, p.father_phone, p.father_occupation,
      p.mother_name, p.mother_email, p.mother_phone, p.mother_occupation,
      g.first_name as guardian_first_name, g.last_name as guardian_last_name,
      g.phone as guardian_phone, g.email as guardian_email, g.occupation as guardian_occupation, g.relation as guardian_relation,
      addr.current_address, addr.permanent_address`;
    const fromAndJoins = `
      FROM students s
      LEFT JOIN classes c ON s.class_id = c.id
      LEFT JOIN sections sec ON s.section_id = sec.id
      LEFT JOIN blood_groups bg ON s.blood_group_id = bg.id
      LEFT JOIN casts cast_t ON s.cast_id = cast_t.id
      LEFT JOIN mother_tongues mt ON s.mother_tongue_id = mt.id
      LEFT JOIN parents p ON s.parent_id = p.id
      LEFT JOIN guardians g ON s.guardian_id = g.id
      LEFT JOIN addresses addr ON s.user_id = addr.user_id`;
    const whereClause = ` WHERE s.id = $1 AND s.is_active = true`;

    let result;
    try {
      result = await query(`
        SELECT ${baseSelect},
          s.religion_id,
          r.religion_name as religion_name
        ${fromAndJoins}
        LEFT JOIN religions r ON s.religion_id = r.id
        ${whereClause}
      `, [id]);
    } catch (e) {
      if (e.message && (e.message.includes('religion_id') || e.message.includes('religions') || e.message.includes('reigion'))) {
        result = await query(`
          SELECT ${baseSelect},
            s.reigion_id as religion_id,
            re.reigion_name as religion_name
          ${fromAndJoins}
          LEFT JOIN reigions re ON s.reigion_id = re.id
          ${whereClause}
        `, [id]);
      } else {
        throw e;
      }
    }

    console.log('Query result for student', id, ':', JSON.stringify(result.rows[0], null, 2));

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'ERROR',
        message: 'Student not found'
      });
    }

    const studentData = result.rows[0];
    try {
      const extra = await query(
        'SELECT bank_name, branch, ifsc, known_allergies, medications FROM students WHERE id = $1',
        [id]
      );
      if (extra.rows.length > 0) {
        Object.assign(studentData, extra.rows[0]);
      } else {
        studentData.bank_name = studentData.bank_name ?? null;
        studentData.branch = studentData.branch ?? null;
        studentData.ifsc = studentData.ifsc ?? null;
        studentData.known_allergies = studentData.known_allergies ?? null;
        studentData.medications = studentData.medications ?? null;
      }
    } catch (e) {
      studentData.bank_name = studentData.bank_name ?? null;
      studentData.branch = studentData.branch ?? null;
      studentData.ifsc = studentData.ifsc ?? null;
      studentData.known_allergies = studentData.known_allergies ?? null;
      studentData.medications = studentData.medications ?? null;
    }
    try {
      if (studentData.hostel_id || studentData.hostel_room_id) {
        console.log('Fetching hostel data for student', id, 'hostel_id:', studentData.hostel_id, 'hostel_room_id:', studentData.hostel_room_id);
        const hostelExtra = await query(`
          SELECT 
            h.hostel_name as hostel_name,
            COALESCE(h.floor, h.floor_number, h.floor_name) as floor,
            COALESCE(
              hr.room_number,
              hr.room_no,
              hr.number,
              hr.room_name,
              h.hostel_room_number,
              h.room_number,
              h.room_no,
              h.number,
              h.room_name
            ) as hostel_room_number
          FROM students s
          LEFT JOIN hostels h ON s.hostel_id = h.id
          LEFT JOIN hostel_room hr ON s.hostel_room_id = hr.id
          WHERE s.id = $1
        `, [id]);
        if (hostelExtra.rows.length > 0 && hostelExtra.rows[0]) {
          const hostelRow = hostelExtra.rows[0];
          studentData.hostel_name = hostelRow.hostel_name;
          studentData.floor = hostelRow.floor;
          studentData.hostel_room_number = hostelRow.hostel_room_number;
          console.log('Hostel data fetched for student', id, ':', { hostel_name: hostelRow.hostel_name, floor: hostelRow.floor, hostel_room_number: hostelRow.hostel_room_number });
        } else {
          console.log('Hostel JOIN query returned empty for student', id, '- trying direct queries');
        }
        // Always try direct queries if names are missing (even if JOIN returned a row with nulls)
        if (studentData.hostel_id && !studentData.hostel_name) {
          const hostelTableNames = ['hostel', 'hostels'];
          for (const tableName of hostelTableNames) {
            try {
              const hostelDirect = await query(`SELECT * FROM ${tableName} WHERE id = $1`, [studentData.hostel_id]);
              if (hostelDirect.rows.length > 0) {
                const h = hostelDirect.rows[0];
                studentData.hostel_name = h.hostel_name || h.name || h.hostel_name || null;
                studentData.floor = h.floor || h.floor_number || h.floor_name || null;
                console.log(`Hostel data fetched directly from ${tableName}:`, { hostel_name: studentData.hostel_name, floor: studentData.floor, allColumns: Object.keys(h) });
                break;
              }
            } catch (e3) {
              console.error(`Direct hostel query failed for table ${tableName}:`, e3.message);
            }
          }
        }
        if (studentData.hostel_room_id && !studentData.hostel_room_number) {
          const roomTableNames = ['hostel_room', 'hostel_rooms', 'hostel_room'];
          for (const tableName of roomTableNames) {
            try {
              const roomDirect = await query(`SELECT * FROM ${tableName} WHERE id = $1`, [studentData.hostel_room_id]);
              if (roomDirect.rows.length > 0) {
                const hr = roomDirect.rows[0];
                studentData.hostel_room_number = hr.room_number || hr.room_no || hr.number || hr.room_name || hr.room_no || null;
                console.log(`Room data fetched directly from ${tableName}:`, { hostel_room_number: studentData.hostel_room_number, allColumns: Object.keys(hr) });
                break;
              }
            } catch (e4) {
              console.error(`Direct room query failed for table ${tableName}:`, e4.message);
            }
          }
        }
        if (!studentData.hostel_name && !studentData.hostel_room_number && !studentData.hostel_id && !studentData.hostel_room_id) {
          studentData.hostel_name = null;
          studentData.floor = null;
          studentData.hostel_room_number = null;
        }
      } else {
        studentData.hostel_name = null;
        studentData.floor = null;
        studentData.hostel_room_number = null;
      }
    } catch (e) {
      console.error('Error fetching hostel data for student', id, ':', e.message);
      if (e.message && (e.message.includes('hostel') || e.message.includes('does not exist'))) {
        try {
          const hostelExtraAlt = await query(`
            SELECT 
              h.hostel_name as hostel_name,
              COALESCE(h.floor, h.floor_number, h.floor_name) as floor,
              COALESCE(
                hr.room_number,
                hr.room_no,
                hr.number,
                hr.room_name,
                h.hostel_room_number,
                h.room_number,
                h.room_no,
                h.number,
                h.room_name
              ) as hostel_room_number
            FROM students s
            LEFT JOIN hostels h ON s.hostel_id = h.id
            LEFT JOIN hostel_rooms hr ON s.hostel_room_id = hr.id
            WHERE s.id = $1
          `, [id]);
          if (hostelExtraAlt.rows.length > 0 && hostelExtraAlt.rows[0]) {
            const hostelRow = hostelExtraAlt.rows[0];
            studentData.hostel_name = hostelRow.hostel_name;
            studentData.floor = hostelRow.floor;
            studentData.hostel_room_number = hostelRow.hostel_room_number;
            console.log('Hostel data fetched with alternative table names');
          }
        } catch (e2) {
          console.error('Alternative hostel query also failed:', e2.message);
        }
      }
      if (!studentData.hostel_name && !studentData.hostel_room_number) {
        studentData.hostel_name = null;
        studentData.floor = null;
        studentData.hostel_room_number = null;
      }
    }
    // Transport: resolve route and pickup point names for edit form
    try {
      if (studentData.route_id) {
        const routeResult = await query('SELECT route_name, name FROM routes WHERE id = $1', [studentData.route_id]);
        if (routeResult.rows.length > 0) {
          const r = routeResult.rows[0];
          studentData.route_name = r.route_name || r.name || null;
        }
      }
      if (studentData.pickup_point_id) {
        const ppResult = await query('SELECT address, pickup_point, name, location, point_name, point_address FROM pickup_points WHERE id = $1', [studentData.pickup_point_id]);
        if (ppResult.rows.length > 0) {
          const pp = ppResult.rows[0];
          studentData.pickup_point_name = pp.pickup_point || pp.address || pp.name || pp.location || pp.point_name || pp.point_address || null;
        }
      }
    } catch (e) {
      console.error('Error fetching transport names for student', id, ':', e.message);
    }
    console.log('Sending response with user_id:', studentData.user_id);
    console.log('Sending response with current_address:', studentData.current_address);
    console.log('Sending response with permanent_address:', studentData.permanent_address);
    
    res.status(200).json({
      status: 'SUCCESS',
      message: 'Student fetched successfully',
      data: studentData
    });
  } catch (error) {
    console.error('Error fetching student:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Failed to fetch student'
    });
  }
};

// Get students by class
const getStudentsByClass = async (req, res) => {
  try {
    const { classId } = req.params;
    
    const result = await query(`
      SELECT
        s.id,
        s.admission_number,
        s.roll_number,
        s.first_name,
        s.last_name,
        s.gender,
        s.date_of_birth,
        s.place_of_birth,
        s.blood_group_id,
        s.religion_id,
        s.cast_id,
        s.mother_tongue_id,
        s.nationality,
        s.phone,
        s.email,
        s.address,
        s.user_id,
        s.academic_year_id,
        s.class_id,
        s.section_id,
        s.house_id,
        s.admission_date,
        s.previous_school,
        s.photo_url,
        s.is_transport_required,
        s.route_id,
        s.pickup_point_id,
        s.is_hostel_required,
        s.hostel_room_id,
        s.parent_id,
        s.guardian_id,
        s.is_active,
        s.created_at,
        c.class_name,
        sec.section_name,
        p.father_name,
        p.father_email,
        p.father_phone,
        p.father_occupation,
        p.mother_name,
        p.mother_email,
        p.mother_phone,
        p.mother_occupation,
        g.first_name as guardian_first_name,
        g.last_name as guardian_last_name,
        g.phone as guardian_phone,
        g.email as guardian_email,
        g.occupation as guardian_occupation,
        g.relation as guardian_relation,
        addr.current_address,
        addr.permanent_address
      FROM students s
      LEFT JOIN classes c ON s.class_id = c.id
      LEFT JOIN sections sec ON s.section_id = sec.id
      LEFT JOIN parents p ON s.parent_id = p.id
      LEFT JOIN guardians g ON s.guardian_id = g.id
      LEFT JOIN addresses addr ON s.user_id = addr.user_id
      WHERE s.class_id = $1 AND s.is_active = true
      ORDER BY s.first_name ASC, s.last_name ASC
    `, [classId]);
    
    res.status(200).json({
      status: 'SUCCESS',
      message: 'Students fetched successfully',
      data: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('Error fetching students by class:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Failed to fetch students'
    });
  }
};

module.exports = {
  createStudent,
  updateStudent,
  getAllStudents,
  getStudentById,
  getStudentsByClass
};
