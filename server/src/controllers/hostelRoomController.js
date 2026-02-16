const { query } = require('../config/database');

// Get all hostel rooms
const getAllHostelRooms = async (req, res) => {
  try {
    // Join with hostels and room_types tables to get complete data
    // Use COALESCE to handle multiple possible column names for room type
    const result = await query(`
      SELECT 
        hr.id,
        hr.room_number,
        hr.hostel_id,
        hr.room_type_id,
        hr.current_occupancy,
        hr.monthly_fee,
        hr.is_active,
        hr.created_at,
        hr.modified_at,
        h.hostel_name,
        rt.room_type,
        rt.description as room_type_description
      FROM hostel_rooms hr
      LEFT JOIN hostels h ON hr.hostel_id = h.id
      LEFT JOIN room_types rt ON hr.room_type_id = rt.id
      WHERE hr.is_active = true
      ORDER BY hr.id ASC
    `);
    
    // Log for debugging
    console.log('=== HOSTEL ROOMS BACKEND DEBUG ===');
    console.log('Total rooms:', result.rows.length);
    if (result.rows.length > 0) {
      console.log('First room data:', result.rows[0]);
      console.log('First room columns:', Object.keys(result.rows[0]));
    }
    
    res.status(200).json({
      status: 'SUCCESS',
      message: 'Hostel rooms fetched successfully',
      data: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('=== ERROR FETCHING HOSTEL ROOMS ===');
    console.error('Error:', error);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.error('Error hint:', error.hint);
    console.error('Error detail:', error.detail);
    res.status(500).json({
      status: 'ERROR',
      message: `Failed to fetch hostel rooms: ${error.message || 'Unknown error'}`,
      error: process.env.NODE_ENV === 'development' ? {
        code: error.code,
        hint: error.hint,
        detail: error.detail
      } : undefined
    });
  }
};

// Get hostel room by ID
const getHostelRoomById = async (req, res) => {
  try {
    const { id } = req.params;
    // Join with hostels and room_types tables to get complete data
    // Use COALESCE to handle multiple possible column names for room type
    const result = await query(`
      SELECT 
        hr.id,
        hr.room_number,
        hr.hostel_id,
        hr.room_type_id,
        hr.current_occupancy,
        hr.monthly_fee,
        hr.is_active,
        hr.created_at,
        hr.modified_at,
        h.hostel_name,
        rt.room_type,
        rt.description as room_type_description
      FROM hostel_rooms hr
      LEFT JOIN hostels h ON hr.hostel_id = h.id
      LEFT JOIN room_types rt ON hr.room_type_id = rt.id
      WHERE hr.id = $1 AND hr.is_active = true
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'ERROR',
        message: 'Hostel room not found'
      });
    }

    res.status(200).json({
      status: 'SUCCESS',
      message: 'Hostel room fetched successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('=== ERROR FETCHING HOSTEL ROOM BY ID ===');
    console.error('Error:', error);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.error('Error hint:', error.hint);
    res.status(500).json({
      status: 'ERROR',
      message: `Failed to fetch hostel room: ${error.message || 'Unknown error'}`,
      error: process.env.NODE_ENV === 'development' ? {
        code: error.code,
        hint: error.hint,
        detail: error.detail
      } : undefined
    });
  }
};

module.exports = {
  getAllHostelRooms,
  getHostelRoomById
};
