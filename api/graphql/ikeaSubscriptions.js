const Tradfri = require("../../lib/tradfri/instance");
// console.log("TCL: Tradfri", Tradfri);
const pubsub = require("../../lib/pubSub");

(async () => {
  const tradfri = await Tradfri;
  // console.log(await Tradfri);
  Tradfri.on("device updated", stuff => console.log(stuff)).observeDevices();
  // tradfri
  //   .on("group updated", stuff => console.log(stuff))
  //   .observeGroupsAndScenes();
  const success = await tradfri.observeResource(
    "65537",
    // callback: (resp: CoapResponse) => void
    stuff => console.log("something happened", stuff)
  );
  console.log("TCL: success", success);
  // await tradfri.observeDevices();
  // await tradfri.observeGroupsAndScenes();
  // await tradfri.observeGateway();
})();
// Tradfri.on("device changed", stuff => console.log(stuff)).observeDevices();
// Tradfri.on("group updated", stuff =>
//   console.log(stuff)
// ).observeGroupsAndScenes();

module.exports = Tradfri;

// Tradfri.observeResource(
//     path: "138204",
//     // callback: (resp: CoapResponse) => void
//     callback: () => console.log("something happened")
// );
// Tradfri.observeResource(
//   "138204",
//   // callback: (resp: CoapResponse) => void
//   () => console.log("something happened")
// );
