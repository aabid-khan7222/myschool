const { query } = require('../config/database');

function getDriverDisplayName(row) {
  if (row.driver_name != null && String(row.driver_name).trim() !== '') return String(row.driver_name).trim();
  if (row.name != null && String(row.name).trim() !== '') return String(row.name).trim();
  const first = row.first_name != null ? String(row.first_name).trim() : '';
  const last = row.last_name != null ? String(row.last_name).trim() : '';
  return [first, last].filter(Boolean).join(' ').trim() || null;
}

function mapDriverRow(row) {
  return {
    id: row.id,
    driver_code: row.driver_code ?? row.employee_code ?? row.code ?? row.id,
    name: getDriverDisplayName(row) ?? '',
    phone: row.phone ?? null,
    license_number: row.license_number ?? row.license_no ?? null,
    address: row.address ?? null,
    is_active: row.is_active !== false && row.is_active !== 'f',
    photo_url: row.photo_url ?? row.photo ?? null,
    created_at: row.created_at
  };
}

const getAllDrivers = async (req, res) => {
  try {
    const result = await query('SELECT * FROM drivers ORDER BY id ASC');
    const data = result.rows.map(mapDriverRow);
    res.status(200).json({
      status: 'SUCCESS',
      message: 'Transport drivers fetched successfully',
      data,
      count: data.length
    });
  } catch (error) {
    console.error('Error fetching transport drivers:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Failed to fetch transport drivers',
    });
  }
};

const getDriverById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query('SELECT * FROM drivers WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ status: 'ERROR', message: 'Driver not found' });
    }
    res.status(200).json({
      status: 'SUCCESS',
      message: 'Transport driver fetched successfully',
      data: mapDriverRow(result.rows[0])
    });
  } catch (error) {
    console.error('Error fetching transport driver:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Failed to fetch transport driver',
    });
  }
};

module.exports = { getAllDrivers, getDriverById };
