const { gql } = require("apollo-server");

const typeDefs = gql`
  type LightSettings {
    name: String
    createdAt: Int
    instanceId: Int
    color: String
    hue: Float
    saturation: Float
    colorY: Float
    colorX: Float
    colorTemperature: Float
    dimmer: Float
    onOff: Boolean
  }

  type Scene {
    name: String
    createdAt: Int
    instanceId: Int
    isActive: Boolean
    isPredefined: Boolean
    lightSettings: [LightSettings]
    sceneIndex: Int
    useCurrentLightSettings: Boolean
  }

  # extend type RootQuery {
  #   scene: Scene
  # }
`;

module.exports = typeDefs;
