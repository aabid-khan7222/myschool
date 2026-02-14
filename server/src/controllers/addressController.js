const { query } = require('../config/database');

// Create new address
const createAddress = async (req, res) => {
  try {
    const {
      current_address,
      permanent_address,
      user_id,
      role_id,
      person_id
    } = req.body;

    // Validate required fields
    if (!current_address || !permanent_address || !user_id || !role_id) {
      return res.status(400).json({
        status: 'ERROR',
        message: 'Current address, permanent address, user_id, and role_id are required'
      });
    }

    const result = await query(`
      INSERT INTO addresses (
        current_address, permanent_address, user_id, role_id, person_id, created_at
      ) VALUES ($1, $2, $3, $4, $5, NOW())
      RETURNING *
    `, [
      current_address, permanent_address, user_id, role_id, person_id || null
    ]);

    res.status(201).json({
      status: 'SUCCESS',
      message: 'Address created successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating address:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Failed to create address',
    });
  }
};

// Update address
const updateAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      current_address,
      permanent_address,
      user_id,
      role_id,
      person_id
    } = req.body;

    // Validate required fields
    if (!current_address || !permanent_address || !user_id || !role_id) {
      return res.status(400).json({
        status: 'ERROR',
        message: 'Current address, permanent address, user_id, and role_id are required'
      });
    }

    const result = await query(`
      UPDATE addresses SET
        current_address = $1,
        permanent_address = $2,
        user_id = $3,
        role_id = $4,
        person_id = $5
      WHERE id = $6
      RETURNING *
    `, [
      current_address, permanent_address, user_id, role_id, person_id || null, id
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'ERROR',
        message: 'Address not found'
      });
    }

    res.status(200).json({
      status: 'SUCCESS',
      message: 'Address updated successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating address:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Failed to update address',
    });
  }
};

// Get all addresses
const getAllAddresses = async (req, res) => {
  try {
    const result = await query(`
      SELECT
        a.id,
        a.current_address,
        a.permanent_address,
        a.user_id,
        a.role_id,
        a.person_id,
        a.created_at,
        u.username,
        ur.role_name
      FROM addresses a
      LEFT JOIN users u ON a.user_id = u.id
      LEFT JOIN user_roles ur ON a.role_id = ur.id
      ORDER BY a.created_at DESC
    `);
    
    res.status(200).json({
      status: 'SUCCESS',
      message: 'Addresses fetched successfully',
      data: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('Error fetching addresses:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Failed to fetch addresses',
    });
  }
};

// Get address by ID
const getAddressById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await query(`
      SELECT
        a.id,
        a.current_address,
        a.permanent_address,
        a.user_id,
        a.role_id,
        a.person_id,
        a.created_at,
        u.username,
        ur.role_name
      FROM addresses a
      LEFT JOIN users u ON a.user_id = u.id
      LEFT JOIN user_roles ur ON a.role_id = ur.id
      WHERE a.id = $1
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'ERROR',
        message: 'Address not found'
      });
    }
    
    res.status(200).json({
      status: 'SUCCESS',
      message: 'Address fetched successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching address:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Failed to fetch address',
    });
  }
};

// Get addresses by user ID
const getAddressesByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const result = await query(`
      SELECT
        a.id,
        a.current_address,
        a.permanent_address,
        a.user_id,
        a.role_id,
        a.person_id,
        a.created_at,
        u.username,
        ur.role_name
      FROM addresses a
      LEFT JOIN users u ON a.user_id = u.id
      LEFT JOIN user_roles ur ON a.role_id = ur.id
      WHERE a.user_id = $1
      ORDER BY a.created_at DESC
    `, [userId]);
    
    res.status(200).json({
      status: 'SUCCESS',
      message: 'Addresses fetched successfully',
      data: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('Error fetching addresses by user:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Failed to fetch addresses',
    });
  }
};

// Delete address
const deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if address is being used by any students
    const studentsUsingAddress = await query(
      'SELECT id FROM students WHERE address_id = $1',
      [id]
    );

    if (studentsUsingAddress.rows.length > 0) {
      return res.status(400).json({
        status: 'ERROR',
        message: 'Cannot delete address as it is being used by students'
      });
    }

    const result = await query(
      'DELETE FROM addresses WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'ERROR',
        message: 'Address not found'
      });
    }

    res.status(200).json({
      status: 'SUCCESS',
      message: 'Address deleted successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error deleting address:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Failed to delete address',
    });
  }
};

module.exports = {
  createAddress,
  updateAddress,
  getAllAddresses,
  getAddressById,
  getAddressesByUserId,
  deleteAddress
};
