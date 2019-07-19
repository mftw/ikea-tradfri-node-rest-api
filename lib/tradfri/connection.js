const Conf = require("conf");
const delay = require("delay");
const NodeTradfriClient = require("node-tradfri-client");

// get the paht to the config file with conf.path default on linux is ~/.config/<project name>
const conf = new Conf();
// console.log("TCL: getConnection -> conf.path", conf.path);

const {
  discoverGateway,
  TradfriClient,
  TradfriError,
  TradfriErrorCodes
} = NodeTradfriClient;

async function getConnection() {
  console.log("Looking up IKEA Tradfri gateway the network");

  try {
    const gateway = await discoverGateway();

    console.log("Connecting to", gateway.host, "@", gateway.addresses[0]);

    // Using .addresses instead of .host because my router isn't happy with DNS lookup's
    // addresses[0] is the IP af the gateway. addresses[1] is the MAC address.
    const tradfri = new TradfriClient(gateway.addresses[0]);
    // const tradfri = new TradfriClient(gateway.host);

    if (!conf.has("security.identity") || !conf.has("security.psk")) {
      let securityCode = process.env.BRIDGE_KEY;

      if (securityCode === "" || securityCode === undefined) {
        console.log(
          "Please set the BRIDGE_KEY env variable to the code on the back of the gateway"
        );
        const error = new Error();
        error.message = "No BRIDGE_KEY in env";
        error.status = 500;
        throw error;
      }

      console.log("Getting identity from security code");
      const { identity, psk } = await tradfri.authenticate(securityCode);
      console.log("TCL: getConnection -> identity, psk", identity, psk);

      conf.set("security", { identity, psk });
    }

    await tradfri.connect(
      conf.get("security.identity"),
      conf.get("security.psk")
    );

    console.log(
      "Connnected to",
      gateway.host,
      "With name:",
      gateway.name,
      "Time:",
      new Date().toUTCString()
    );

    return tradfri;
  } catch (e) {
    if (e instanceof TradfriError) {
      switch (e.code) {
        case TradfriErrorCodes.ConnectionTimedOut: {
          // The gateway is unreachable or did not respond in time
        }
        case TradfriErrorCodes.AuthenticationFailed: {
          // The security code is wrong or something else went wrong with the authentication.
          // Check the error message for details. It might be that this library has to be updated
          // to be compatible with a new firmware.
          // console.warn("Authentication failed");
        }
        case TradfriErrorCodes.ConnectionFailed: {
          // An unknown error happened while trying to connect
        }
      }
    }
    console.log("Connection Error:", e);
  }
}

async function connectAndObserve() {
  const tradfri = await getConnection();
  tradfri.observeDevices();
  tradfri.observeGroupsAndScenes();
  await delay(1000);
  return tradfri;
}

module.exports = {
  getConnection,
  connectAndObserve
};
