const { query } = require('../config/database');

// Get all hostel rooms
const getAllHostelRooms = async (req, res) => {
  try {
    // Use exact table names: hostel_rooms (plural) with hostels (plural) - SELECT * to get all available columns
    const result = await query(`
      SELECT 
        hr.*,
        h.hostel_name
      FROM hostel_rooms hr
      LEFT JOIN hostels h ON hr.hostel_id = h.id
      WHERE hr.is_active = true
      ORDER BY hr.id ASC
    `);
    
    res.status(200).json({
      status: 'SUCCESS',
      message: 'Hostel rooms fetched successfully',
      data: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('Error fetching hostel rooms:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Failed to fetch hostel rooms',
    });
  }
};

// Get hostel room by ID
const getHostelRoomById = async (req, res) => {
  try {
    const { id } = req.params;
    // Use exact table names: hostel_rooms (plural) with hostels (plural) - SELECT * to get all available columns
    const result = await query(`
      SELECT 
        hr.*,
        h.hostel_name
      FROM hostel_rooms hr
      LEFT JOIN hostels h ON hr.hostel_id = h.id
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
    console.error('Error fetching hostel room:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Failed to fetch hostel room',
    });
  }
};

module.exports = {
  getAllHostelRooms,
  getHostelRoomById
};
