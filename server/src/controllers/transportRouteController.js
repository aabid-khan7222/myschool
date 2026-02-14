const { query } = require('../config/database');

function mapRouteRow(row) {
  return {
    id: row.id,
    route_code: row.route_code ?? row.code ?? row.id,
    route_name: row.route_name ?? row.name ?? '',
    is_active: row.is_active !== false && row.is_active !== 'f',
    created_at: row.created_at
  };
}

const getAllRoutes = async (req, res) => {
  try {
    const result = await query('SELECT * FROM routes ORDER BY id ASC');
    const data = result.rows.map(mapRouteRow);
    res.status(200).json({
      status: 'SUCCESS',
      message: 'Transport routes fetched successfully',
      data,
      count: data.length
    });
  } catch (error) {
    console.error('Error fetching transport routes:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Failed to fetch transport routes',
    });
  }
};

const getRouteById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query('SELECT * FROM routes WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ status: 'ERROR', message: 'Route not found' });
    }
    res.status(200).json({
      status: 'SUCCESS',
      message: 'Transport route fetched successfully',
      data: mapRouteRow(result.rows[0])
    });
  } catch (error) {
    console.error('Error fetching transport route:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Failed to fetch transport route',
    });
  }
};

module.exports = { getAllRoutes, getRouteById };
