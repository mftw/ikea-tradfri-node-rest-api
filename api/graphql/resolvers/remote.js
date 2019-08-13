module.exports = {
  // News: async (parent, args, context, info) => {
  // const { from, to, reverse } = args;
  remotes: async (_, __, { tradfri }) => {
    const localTradfri = await tradfri;
    const allDevices = Object.entries(localTradfri.devices);
    const moddedRemotes = allDevices.reduce((acc, deviceKeyval) => {
      // console.log("TCL: acc", typeof acc);
      const device = deviceKeyval[1];
      if (device.type === 0) {
        const moddedDevice = {
          ...device,
          ...device.deviceInfo,
        };
        acc.push(moddedDevice);
      }
      return acc;
    }, []);
    // console.log("TCL: moddedRemotes", moddedRemotes);
    return moddedRemotes;
  },
  remoteById: async (_, { id }, { tradfri }) => {
    const localTradfri = await tradfri;
    const device = localTradfri.devices[id];
    if (!device || device.type !== 0) throw Error("not found");
    return {
      ...device,
      ...device.deviceInfo,
    };
  },
};
