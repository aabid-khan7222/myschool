const { query } = require('../config/database');

function mapPickupRow(row) {
  return {
    id: row.id,
    pickup_code: row.pickup_code ?? row.code ?? row.id,
    address: row.address ?? row.name ?? row.location ?? '',
    is_active: row.is_active !== false && row.is_active !== 'f',
    created_at: row.created_at
  };
}

const getAllPickupPoints = async (req, res) => {
  try {
    const result = await query('SELECT * FROM pickup_points ORDER BY id ASC');
    const data = result.rows.map(mapPickupRow);
    res.status(200).json({
      status: 'SUCCESS',
      message: 'Pickup points fetched successfully',
      data,
      count: data.length
    });
  } catch (error) {
    console.error('Error fetching pickup points:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Failed to fetch pickup points',
    });
  }
};

const getPickupPointById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query('SELECT * FROM pickup_points WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ status: 'ERROR', message: 'Pickup point not found' });
    }
    res.status(200).json({
      status: 'SUCCESS',
      message: 'Pickup point fetched successfully',
      data: mapPickupRow(result.rows[0])
    });
  } catch (error) {
    console.error('Error fetching pickup point:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Failed to fetch pickup point',
    });
  }
};

module.exports = { getAllPickupPoints, getPickupPointById };
