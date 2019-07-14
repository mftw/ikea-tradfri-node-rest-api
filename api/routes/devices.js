const express = require("express");
const router = express.Router();

const DeviceController = require("../controllers/devices");

router.get("/", DeviceController.show_all_devices);

router.get("/get-single-device", DeviceController.show_single_device);

router.get("/set-device", DeviceController.set_device);

module.exports = router;
