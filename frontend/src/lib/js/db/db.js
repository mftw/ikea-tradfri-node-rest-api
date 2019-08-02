// const low = require("lowdb");
// const LocalStorage = require("lowdb/adapters/LocalStorage");
import low from "lowdb";
import LocalStorage from "lowdb/adapters/LocalStorage";

const adapter = new LocalStorage("tradfri-db");
const db = low(adapter);

// Initialize the database if it is empty or missing
db.defaults({
  security: {},
  devices: [],
  groups: [],
}).write();

db.writeDevicesWhen = (devices, expectedDevices) => {};

// module.exports = db;
export default db;
