const Tradfri = require("../../../lib/tradfri/instance");
const PubSub = require("../../../lib/pubSub");

const POLLING_TIME = 500; // MS

const lastGroups = {};
(async () => {
  const tradfri = await Tradfri;
  const groups = tradfri.groups;
  for (const group in groups) {
    // Use spread to make a shallow copy or else we can't compare changes
    lastGroups[group] = { ...groups[group] };
  }
})();
console.log("TCL: lastGroups", lastGroups);

setInterval(async () => {
  const tradfri = await Tradfri;
  const groups = tradfri.groups;
  for (const group in groups) {
    if (lastGroups[group].group.sceneId !== groups[group].group.sceneId) {
      // console.log("hit!");
      console.log(
        "changes!!! from:",
        lastGroups[group].group.sceneId,
        "to:",
        groups[group].group.sceneId
      );
      PubSub.publish("SCENE_CHANGE", {
        sceneChange: {
          instanceId: group,
          toSceneId: groups[group].group.sceneId,
          fromSceneId: lastGroups[group].group.sceneId,
        },
      });
      lastGroups[group] = { ...groups[group] };
    }
  }
}, POLLING_TIME);

setInterval(async () => {
  const tradfri = await Tradfri;
}, 500);
