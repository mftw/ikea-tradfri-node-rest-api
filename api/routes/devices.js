const express = require("express");
const router = express.Router();

const DeviceController = require("../controllers/devices");

router.post("/", DeviceController.show_all_devices);

router.post("/get-single-device", DeviceController.show_single_device);

router.post("/set-device", DeviceController.set_device);

router.post("/get-battery-life", DeviceController.get_battery_life);

module.exports = router;
