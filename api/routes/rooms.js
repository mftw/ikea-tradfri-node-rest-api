const express = require("express");
const router = express.Router();

const RoomController = require("../controllers/rooms");

router.get("/", RoomController.show_all_rooms);

router.get("/get-single-room", RoomController.show_single_room);

router.get("/set-room", RoomController.set_room);

module.exports = router;
