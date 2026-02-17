const express = require('express');
const { getAllRoutes, getRouteById, updateRoute } = require('../controllers/transportRouteController');
const { getAllPickupPoints, getPickupPointById, updatePickupPoint } = require('../controllers/transportPickupController');
const { getAllVehicles, getVehicleById, updateVehicle } = require('../controllers/transportVehicleController');
const { getAllDrivers, getDriverById, updateDriver } = require('../controllers/transportDriverController');

const router = express.Router();

// Transport routes (route names)
router.get('/routes', getAllRoutes);
router.put('/routes/:id', updateRoute);
router.get('/routes/:id', getRouteById);

// Pickup points
router.get('/pickup-points', getAllPickupPoints);
router.put('/pickup-points/:id', updatePickupPoint);
router.get('/pickup-points/:id', getPickupPointById);

// Vehicles (driver_id = assignment to driver)
router.get('/vehicles', getAllVehicles);
router.put('/vehicles/:id', updateVehicle);
router.get('/vehicles/:id', getVehicleById);

// Drivers
router.get('/drivers', getAllDrivers);
router.put('/drivers/:id', updateDriver);
router.get('/drivers/:id', getDriverById);

module.exports = router;
