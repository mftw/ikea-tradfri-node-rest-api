const Tradfri = require("../../lib/tradfri/instance");
const { changeDevice } = require("../../lib/tradfri/devices");

/**
 * Finds all individual groups and turns them on or off
 * @param {Bool} on on/off switch
 * @returns {Array} Key value pair with each group and the result
 */
const masterswitch = async on => {
  const tradfri = await Tradfri;

  const operation = {
    onOff: on ? true : false
  };

  const report = [];

  for (const group in tradfri.groups) {
    if (tradfri.groups.hasOwnProperty(group)) {
      const currentGroup = tradfri.groups[group];
      const requestSent = await tradfri.operateGroup(
        currentGroup.group,
        operation,
        true
      );

      report.push([
        currentGroup.group.name,
        requestSent ? "on" : "off"
      ]);
    }
  }

  return report;
};

/**
 * Finds all individual devices and turns them on or off
 * @param {Bool} on on/off switch
 * @returns {Array} Key value pair with each group and the result
 */
const masterswitchForce = async on => {
  const tradfri = await Tradfri;
  const devices = tradfri.devices;

  const action = {
    name: on ? "on" : "off"
  };

  const report = [];

  // loop through the device list object
  for (const device in devices) {
    if (devices.hasOwnProperty(device)) {
      const currentDevice = devices[device];
      const controllableDevice =
      // Only attempt to control lights (2) and plugs (3)
      currentDevice.type === 2 || currentDevice.type === 3 || false;

      // Continue if we are unable to control the device (e.g remote)
      if (!controllableDevice) continue;

      // Continue if the device is dead e.g power outage
      if (!currentDevice.alive) continue;

      const onOff =
        currentDevice.type === 2
          ? currentDevice.lightList[0].onOff
          : currentDevice.plugList[0].onOff;

      // Continue if the device is already in desired state
      if (onOff === on) continue;

      const result = changeDevice(tradfri, currentDevice, action);

      if (currentDevice.type === 2) {
        report.push([currentDevice.name, result.action.name]);
      } else if (currentDevice.type === 3) {
        report.push([currentDevice.name, result.action.name]);
      }
    }
  }

  return report;
};

exports.all_off = async (req, res, next) => {
  const { confirmation, force } = req.body;

  if (!confirmation) {
    return res.status(400).json({ message: "Need confirmation in request" });
  }

  const report = force ? await masterswitchForce(false) : await masterswitch(false);

  return res.status(200).json({ report });
};

exports.all_on = async (req, res, next) => {
  const { confirmation, force } = req.body;

  if (!confirmation) {
    return res.status(400).json({ message: "Need confirmation in request" });
  }

  const report = force ? await masterswitchForce(true) : await masterswitch(true);

  return res.status(200).json({ report });
};
