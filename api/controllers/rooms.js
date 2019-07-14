const { findRoom } = require("../../lib/tradfri/rooms");
const tradfri = require("../../lib/tradfri/instance");

exports.show_all_rooms = async (req, res, next) => {
  const localTradfri = await tradfri;
  return res.status(200).json(Object.entries(localTradfri.groups));
};

exports.show_single_room = async (req, res, next) => {
  if (!req.body.room) {
    return res.status(400).json({});
  }

  const { room: reqRoom } = req.body;
  const room = findRoom(await tradfri, reqRoom.name);

  if (!room) {
    return res.status(200).json({ message: `Room ${reqRoom.name} not found` });
  }

  return res.status(200).json(room);
};

exports.set_room = async (req, res, next) => {
  if (!req.body.room) {
    return res.status(400).json({});
  }

  const { name, scene: sceneName } = req.body.room;

  if (!name || !sceneName) {
    return res.status(400).json({});
  }

  const room = findRoom(await tradfri, name);

  let scene = null;

  const lowerSceneName = sceneName.toLowerCase();
  // Look for the scene
  for (const sceneId in room.scenes) {
    if (room.scenes[sceneId].name.toLowerCase() === lowerSceneName) {
      scene = room.scenes[sceneId];
    }
  }

  if (scene === null) {
    console.log("Unable to find scene named", lowerSceneName);
    return res
      .status(400)
      .json({ message: `Unable to find scene named ${lowerSceneName}` });
  }

  room.group.client = await tradfri;
  console.log("Switching", room.group.name, "to scene", scene.name);
  room.group.activateScene(scene.instanceId);

  // console.log("TCL: exports.set_room -> room", room);
  return res
    .status(200)
    .json({ message: `Switched ${room.group.name} to scene ${scene.name}` });
};
