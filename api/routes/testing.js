const express = require("express");
const router = express.Router();
const Testing = require("../controllers/testing");

router.get("/", Testing)

module.exports = router;