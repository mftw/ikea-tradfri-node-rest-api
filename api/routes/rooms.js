const express = require("express");
const router = express.Router();

const RoomController = require("../controllers/rooms");

router.post("/", RoomController.show_all_rooms);

router.post("/get-single-room", RoomController.show_single_room);

router.post("/set-room", RoomController.set_room);

module.exports = router;
