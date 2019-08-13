const { connectAndObserve } = require("./connection");

// Running an instance of Tradfri client to be imported across the app
// preventing the need to reconnect on each command.
// Runs an IIFE that returns the connected Tradfri client instance
// with observeDevices() and observeGroupsAndDevices() invoked.
module.exports = (async () => {
  //async initiallization
  console.clear();
  try {
    const tradfri = await connectAndObserve();
    return tradfri;
  } catch (error) {
    console.log("connection error!", error.message);
  }
})();
