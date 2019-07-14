function findRoom(tradfri, name) {
  if (!name) {
    return false;
  }
  const lowerName = name.toLowerCase();

  // Look for the group
  for (const groupId in tradfri.groups) {
    if (tradfri.groups[groupId].group.name.toLowerCase() === lowerName) {
      return tradfri.groups[groupId];
    }

    if (groupId === name) {
      return tradfri.groups[groupId];
    }
  }

  return false;
}

module.exports = { findRoom };
