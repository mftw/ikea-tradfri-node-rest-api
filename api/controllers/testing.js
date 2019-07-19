const Tradfri = require("../../lib/tradfri/instance");

module.exports = async (req, res, next) => {
  const tradfri = await Tradfri;
  // console.log("TCL: Tradfri", tradfri.groups)
  // console.log(req.body);
  const { groupOperation } = req.body;

  const { operation, group: reqGroup } = groupOperation;
  // const reqGroup = req.body.groupOperation.group;

  let currentGroup = null;
  for (const groups in tradfri.groups) {
    if (tradfri.groups.hasOwnProperty(groups)) {
      const group = tradfri.groups[groups];
      if (group == reqGroup) {
        currentGroup = group;
      }
      if (
        group.group.name.toLowerCase() === reqGroup.toString().toLowerCase()
      ) {
        currentGroup = group;
      }
    }
  }

  // the operateGroup method does NOT take a config object
  const requestSent = await tradfri.operateGroup(
    currentGroup.group,
    operation,
    true
  );

  return res.status(200).json({
    requestSuccess: requestSent,
    groupOperation
  });
};


/**
 * LightOperation: {
    onOff: boolean;
    dimmer: number;
    transitionTime: number;
    colorTemperature: number;
    color: string;
    hue: number;
    saturation: number;
  }
 */