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

  extend type RootQuery {
    groups: [Group]
  }
`;

module.exports = typeDefs;
