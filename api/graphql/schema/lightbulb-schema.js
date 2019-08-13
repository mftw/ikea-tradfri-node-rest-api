const { gql } = require("apollo-server");

module.exports = gql`
  type LightListItem {
    onOff: Boolean
    dimmer: Float
    color: String
    transitionTime: Float
  }

  type Lightbulb {
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
    lightList: [LightListItem]
  }

  extend type RootQuery {
    lightbulbs: [Lightbulb]
  }
`;
