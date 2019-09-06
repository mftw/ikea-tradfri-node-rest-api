const { gql } = require("apollo-server");

module.exports = gql`
  type SwitchListItem {
    onOff: Boolean
    dimmer: Float
    color: String
    transitiontime: Float
  }

  type Remote {
    name: String
    instanceId: Int
    type: Int
    lastSeen: Int
    firmwareVersion: String
    manufacturer: String
    modelNumber: String
    power: Int
    otaUpdateState: Int
    alive: Boolean
    battery: Int
    # switchList: [SwitchListItem]
  }

  extend type RootQuery {
    remotes: [Remote]
    remoteById(id: String): Remote
  }
`;
