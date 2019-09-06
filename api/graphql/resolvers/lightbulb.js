module.exports = {
  lightbulbs: async (_, _args, { tradfri }) => {
    const localTradfri = await tradfri;
    const allDevices = Object.entries(localTradfri.devices);
    const moddedBulbs = allDevices.reduce((acc, deviceKeyval) => {
      // console.log("TCL: acc", typeof acc);
      const device = deviceKeyval[1];
      // console.log("TCL: device", device);
      if (device.type === 2) {
        const moddedDevice = {
          ...device.deviceInfo,
          ...device,
        };
        acc.push(moddedDevice);
      }
      return acc;
    }, []);
    // console.log("TCL: moddedRemotes", moddedRemotes);
    return moddedBulbs;
  },
};
