const { query } = require('../config/database');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const serverConfig = require('../config/server');
const { success, error: errorResponse } = require('../utils/responseHelper');

/**
 * Login - authenticate user with username/phone and password
 * Uses bcrypt.compare with password_hash column.
 * Backward compat: if password_hash is empty, compares with phone and migrates hash on success.
 * Lookup by username, email, or phone.
 */
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return errorResponse(res, 400, 'Username and password are required');
    }

    if (!serverConfig.jwtSecret) {
      return errorResponse(res, 500, 'Server configuration error');
    }

    const identifier = username.trim().toString();
    const enteredPassword = (password || '').toString().trim();

    let userResult;
    try {
      userResult = await query(
        `SELECT u.id, u.username, u.first_name, u.last_name, u.role_id,
                u.phone, u.password_hash,
                ur.role_name,
                st.id as staff_id, st.first_name as staff_first_name, st.last_name as staff_last_name
         FROM users u
         LEFT JOIN user_roles ur ON u.role_id = ur.id
         LEFT JOIN staff st ON u.id = st.user_id AND st.is_active = true
         WHERE u.is_active = true
           AND (u.username = $1 OR u.email = $1 OR u.phone = $1)
         LIMIT 1`,
        [identifier]
      );
    } catch (e) {
      if (e.message && (e.message.includes('email') || e.message.includes('password_hash'))) {
        userResult = await query(
          `SELECT u.id, u.username, u.first_name, u.last_name, u.role_id,
                  u.phone, u.password_hash,
                  ur.role_name,
                  st.id as staff_id, st.first_name as staff_first_name, st.last_name as staff_last_name
           FROM users u
           LEFT JOIN user_roles ur ON u.role_id = ur.id
           LEFT JOIN staff st ON u.id = st.user_id AND st.is_active = true
           WHERE u.is_active = true AND (u.username = $1 OR u.phone = $1)
           LIMIT 1`,
          [identifier]
        );
      } else {
        throw e;
      }
    }

    if (userResult.rows.length === 0) {
      return errorResponse(res, 401, 'Invalid username or password');
    }

    const user = userResult.rows[0];
    const storedPhone = (user.phone || '').toString().trim();
    const passwordHash = user.password_hash;

    if (!storedPhone && !passwordHash) {
      return errorResponse(res, 401, 'Account not configured for login. Please contact admin.');
    }

    let passwordValid = false;
    if (passwordHash) {
      try {
        passwordValid = await bcrypt.compare(enteredPassword, passwordHash);
      } catch {
        passwordValid = false;
      }
    }
    if (!passwordValid && storedPhone) {
      passwordValid = enteredPassword === storedPhone;
      if (passwordValid) {
        const hash = bcrypt.hashSync(enteredPassword, 10);
        await query('UPDATE users SET password_hash = $1 WHERE id = $2', [hash, user.id]).catch(() => {});
      }
    }
    if (!passwordValid) {
      return errorResponse(res, 401, 'Invalid username or password');
    }

    const payload = {
      id: user.id,
      username: user.username,
      role_id: user.role_id,
      role_name: user.role_name || 'User'
    };

    const token = jwt.sign(
      payload,
      serverConfig.jwtSecret,
      { expiresIn: serverConfig.jwtExpiresIn || '7d' }
    );

    const displayName = (user.staff_first_name || user.first_name)
      ? `${user.staff_first_name || user.first_name} ${user.staff_last_name || user.last_name}`.trim()
      : user.username;

    success(res, 200, 'Login successful', {
      token,
      user: {
        id: user.id,
        username: user.username,
        displayName,
        role: user.role_name || 'User',
        role_id: user.role_id,
        staff_id: user.staff_id
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    errorResponse(res, 500, 'Login failed');
  }
};

/**
 * Get current user from token - returns full user details from DB (like getUserById)
 * so students/parents can get their profile without needing Admin permission
 */
const getMe = async (req, res) => {
  try {
    const tokenUser = req.user;
    if (!tokenUser || !tokenUser.id) {
      return errorResponse(res, 401, 'Not authenticated');
    }
    const result = await query(
      `SELECT 
        u.*,
        s.first_name AS student_first_name,
        s.last_name AS student_last_name,
        c.class_name,
        sec.section_name,
        st.first_name AS staff_first_name,
        st.last_name AS staff_last_name,
        d.designation_name,
        ur.role_name
      FROM users u
      LEFT JOIN students s ON u.id = s.user_id AND s.is_active = true
      LEFT JOIN classes c ON s.class_id = c.id
      LEFT JOIN sections sec ON s.section_id = sec.id
      LEFT JOIN staff st ON u.id = st.user_id AND st.is_active = true
      LEFT JOIN designations d ON st.designation_id = d.id
      LEFT JOIN user_roles ur ON u.role_id = ur.id
      WHERE u.id = $1 AND u.is_active = true`,
      [tokenUser.id]
    );
    if (result.rows.length === 0) {
      return errorResponse(res, 404, 'User not found');
    }
    const user = result.rows[0];
    let displayName = '';
    let displayRole = '';
    if (user.student_first_name || user.student_last_name) {
      displayName = `${user.student_first_name || ''} ${user.student_last_name || ''}`.trim();
      displayRole = user.role_name || 'Student';
    } else if (user.staff_first_name || user.staff_last_name) {
      displayName = `${user.staff_first_name || ''} ${user.staff_last_name || ''}`.trim();
      displayRole = user.designation_name || user.role_name || 'Teacher';
    } else {
      displayName = `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username || 'User';
      displayRole = user.role_name || 'User';
    }
    const userData = {
      ...user,
      display_name: displayName,
      display_role: displayRole,
    };
    success(res, 200, 'User fetched', userData);
  } catch (err) {
    console.error('GetMe error:', err);
    errorResponse(res, 500, 'Failed to fetch user');
  }
};

module.exports = { login, getMe };
