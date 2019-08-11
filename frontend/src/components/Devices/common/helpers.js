export function setLocalStorageXY(cords, id) {
  return window.localStorage.setItem("" + id, JSON.stringify(cords));
  // db.get("devices")
  //   .find(device => id in device)
  //   .assign({ cords })
  //   .write();
}

export function getLocalStorageXY(remoteId) {
  return window.localStorage.getItem("" + remoteId);
}

export function removeLocalStorageXY(remoteId) {
  return window.localStorage.removeItem("" + remoteId);
}

export function calcDir(currentItem, circleSize, itemCount, setRotation = 0) {
  const angle = 360 / itemCount;
  const rotation = angle * currentItem - 90 + setRotation;

  const offSet = (circleSize / 100) * (itemCount * Math.PI);

  return `rotate(${rotation}deg) translate(${circleSize +
    offSet}px) rotate(${-rotation}deg)`;
}
