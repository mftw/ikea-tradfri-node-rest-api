const Tradfri = require("../../lib/tradfri/instance");
const { changeDevice } = require("../../lib/tradfri/devices");

exports.all_off = async (req, res, next) => {
  const tradfri = await Tradfri;
  const devices = tradfri.devices;
  const confirmation = req.body.confirmation;

  if (!confirmation) {
    return res.status(400).json({ message: "Need confirmation in request" });
  }

  const action = {
    name: "off"
  };

  const report = [];

  // loop through the device list object
  for (const device in devices) {
    const currentDevice = devices[device];
    const controllableDevice =
      // Only attempt to control lights (2) and plugs (3)
      currentDevice.type === 2 || currentDevice.type === 3 || false;

    // Continue if we are unable to control the device (e.g remote)
    if (!controllableDevice) continue;

    const onOff =
      currentDevice.type === 2
        ? currentDevice.lightList[0].onOff
        : currentDevice.plugList[0].onOff;

    // Continue if the device is already turned off
    if (!onOff) continue;

    changeDevice(tradfri, currentDevice, action);

    if (currentDevice.type === 2) {
      report.push(`Light ${currentDevice.name} was turned off`);
    } else if (currentDevice.type === 3) {
      report.push(`Plug ${currentDevice.name} was turned off`);
    }
  }

  return res.status(200).json({ report });
};

exports.all_on = async (req, res, next) => {
  const tradfri = await Tradfri;
  const devices = tradfri.devices;
  const confirmation = req.body.confirmation;

  if (!confirmation) {
    return res.status(400).json({ message: "Need confirmation in request" });
  }

  const action = {
    name: "on"
  };

  const report = [];

  // loop through the device list object
  for (const device in devices) {
    const currentDevice = devices[device];
    const controllableDevice =
      // Only attempt to control lights (2) and plugs (3)
      currentDevice.type === 2 || currentDevice.type === 3 || false;
      
    // Continue if we are unable to control the device (e.g remote)
    if (!controllableDevice) continue;

    const onOff =
      currentDevice.type === 2
        ? currentDevice.lightList[0].onOff
        : currentDevice.plugList[0].onOff;

    // Continue if the device is already turned on
    if (onOff) continue;

    changeDevice(tradfri, currentDevice, action);

    if (currentDevice.type === 2) {
      report.push(`Light ${currentDevice.name} was turned on`);
    } else if (currentDevice.type === 3) {
      report.push(`Plug ${currentDevice.name} was turned on`);
    }
  }

  return res.status(200).json({ report });
};
