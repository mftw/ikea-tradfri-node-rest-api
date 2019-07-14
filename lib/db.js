const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

const adapter = new FileSync("tradfri.json");
const db = low(adapter);

// Initialize the database if it is empty
db.defaults({
  security: {},
  devices: []
}).write();

module.exports = db;
