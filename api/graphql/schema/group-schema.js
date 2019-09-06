const { gql } = require("apollo-server");

const typeDefs = gql`
  type Group {
    name: String
    createdAt: Int
    instanceId: Int
    onOff: Boolean
    dimmer: Float
    deviceIDs: [Int]
    sceneId: Int
    groupType: Int
    # groupInfo: GroupInfo
    scenes: [Scene]
  }

  type SceneChange {
    instanceId: String!
    toSceneId: String!
    fromSceneId: String!
  }

  extend type Subscription {
    sceneChange: SceneChange!
  }

  extend type RootQuery {
    groups: [Group]
  }
`;

module.exports = typeDefs;
