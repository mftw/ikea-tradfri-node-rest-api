module.exports = {
  groups: async (_parent, _args, { tradfri }, _info) => {
    const localTradfri = await tradfri;
    // console.log(localTradfri.groups["138204"].group);

    // const groups = localTradfri.groups;
    const groupsKeyVal = Object.entries(localTradfri.groups);
    const moddedGroups = groupsKeyVal.map(group => {
      const scenes = Object.entries(group[1].scenes).map(scene => scene[1]);
      // console.log("TCL: scenes", scenes);
      return {
        ...group[1].group,
        scenes: scenes,
      };
    });
    // console.log("TCL: moddedGroups", moddedGroups[0].);

    return moddedGroups;
  },
};
