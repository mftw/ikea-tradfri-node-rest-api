const {
  findDevice,
  changeDevice,
  getBatteryLife,
} = require("../../lib/tradfri/devices");
const Tradfri = require("../../lib/tradfri/instance");

exports.show_all_devices = async (req, res, next) => {
  const tradfri = await Tradfri;

  // be nice and return an iterable array. Everyone loves that.
  return res.status(200).json(Object.entries(tradfri.devices));
};

exports.show_single_device = async (req, res, next) => {
  const nameOrId = req.body.deviceNameOrId;

  if (!nameOrId) {
    return res
      .status(400)
      .json({ message: `example: {"deviceNameOrId": "65539"}` });
  }
  const device = findDevice(await Tradfri, nameOrId);

  if (!device) {
    return res
      .status(404)
      .json({ message: `No device with name or Id of: ${nameOrId}` });
  }

  return res.status(200).json(device);
};

exports.set_device = async (req, res, next) => {
  console.log(req.body);
  const { deviceNameOrId, action } = req.body;

  if (!deviceNameOrId || !action) {
    return res.status(400).json({});
  }

  const tradfri = await Tradfri;
  const device = findDevice(tradfri, deviceNameOrId);

  if (!device) {
    return res
      .status(404)
      .json({ message: `No device with name or Id ${deviceNameOrId}` });
  }

  if (!device.alive) {
    console.log("device dead");
    return res.status(200).json({
      message: `Device ${deviceNameOrId} is currently unreachable e.g power outage`,
    });
  }
  // const result = changeDevice(tradfri, deviceNameOrId, action);
  const result = changeDevice(tradfri, device, action);
  return res.status(200).json(result);
  // return res.status(200).json(device);
};

exports.get_battery_life = async (req, res, next) => {
  const tradfri = await Tradfri;

  // be nice and return an iterable array. Everyone loves that.
  //console.log(tradfri.devices);
  return res.status(200).json(getBatteryLife(tradfri));
};
