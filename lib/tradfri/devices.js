/**
 * Find devices in the TradfriClient
 * @param {Intance} tradfri an active and connected instance of TradfriClient from the "node-tradfri-client" package 
 * @param {String} deviceNameOrId the name or the id of the device to find
 * @returns {Object} the device it found
 */
function findDevice(tradfri, deviceNameOrId) {
  console.log("TCL: findDevice -> deviceNameOrId", deviceNameOrId)
  const lowerName = deviceNameOrId.toLowerCase();

  for (const deviceId in tradfri.devices) {
    if (deviceId === deviceNameOrId) {
      return tradfri.devices[deviceId];
    }

    if (tradfri.devices[deviceId].name.toLowerCase() === lowerName) {
      return tradfri.devices[deviceId];
    }
  }

  return false;
}

/**
 * Change the state of devices
 * @param {Instance} tradfri an active and connected instance of TradfriClient from the "node-tradfri-client" package
 * @param {Object | String} device either the device Object itself or the name or the id of the device 
 * @param {Object} action an object which describes the action to be taken 
 * @returns {Object} Contains the action taken and the device that changed
 */
function changeDevice(tradfri, device, action) {
  const currentDevice =
    typeof device === "string" ? findDevice(tradfri, device) : device;
  // const { name: actionName, value: actionValue } = action;
  if (!currentDevice) {
    console.log("Unable to find device", device);
    // console.log(tradfri.devices);
    return { message: `No device with name or Id of: ${device}` };
  }
  // let currentDevice = null;
  let accessory = null;
  
  switch (currentDevice.type) {
    case 0:
    case 4:
      console.log("Can't control this type of device");
      break;
    case 2: //light
      accessory = currentDevice.lightList[0];
      accessory.client = tradfri;
      break;
    case 3: // plug
      accessory = currentDevice.plugList[0];
      accessory.client = tradfri;
      break;
  }

  switch (action.name) {
    case "on":
      console.log("Turning", currentDevice.instanceId, "on");
      accessory.turnOn();
      break;
    case "off":
      console.log("Turning", currentDevice.instanceId, "off");
      accessory.turnOff();
      break;
    case "toggle":
      accessory.toggle();
      console.log("toggle device", currentDevice.instanceId);
      break;
    case "color":
      position++;
      console.log(
        "Setting color of",
        currentDevice.instanceId,
        "to",
        action.value
      );
      accessory.setColor(action.value);
      break;
    case "brightness":
      console.log(
        "Setting brightness of",
        currentDevice.instanceId,
        "to",
        action.value
      );
      accessory.setBrightness(action.value);
      break;
  }

  return {
    // success: {
    // }
    action,
    device
  };
}

module.exports = { 
  findDevice, 
  changeDevice 
};