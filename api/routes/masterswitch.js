const express = require("express");
const router = express.Router();

const Masterswitch = require("../controllers/masterswitch");

router.post("/", Masterswitch.all_off);

router.post("/all-on", Masterswitch.all_on);

module.exports = router;
