const express = require("express");
const router = express.Router();

const Masterswitch = require("../controllers/masterswitch");

router.get("/", Masterswitch.all_off);

router.get("/all-on", Masterswitch.all_on);

module.exports = router;
