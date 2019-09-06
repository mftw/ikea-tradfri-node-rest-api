// const { mergeSchemas } = require("graphql-tools");
const { mergeTypeDefs } = require("graphql-tools-merge-typedefs");
const { gql } = require("apollo-server");
const groupSchema = require("./group-schema");
const sceneSchema = require("./scene-schema");
const lightbulbSchema = require("./lightbulb-schema");
const remoteSchema = require("./remote-schema");
const schemaTest = require("./schemaTest");

const root = gql`
  type RootQuery {
    _empty: String
  }
  type Subscription {
    heartbeat: String!
  }
  schema {
    query: RootQuery
    subscription: Subscription
  }
`;

const schemas = [
  root,
  schemaTest,
  groupSchema,
  sceneSchema,
  lightbulbSchema,
  remoteSchema,
];

module.exports = mergeTypeDefs(schemas, { all: true });
