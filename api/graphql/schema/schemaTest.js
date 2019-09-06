const { gql } = require("apollo-server");

const typeDefs = gql`
  type Test {
    id: Int!
    title: String!
    content: String!
  }

  # type Subscription {
  #   heartbeat: String!
  # }
  extend type RootQuery {
    test: Test!
    # subscription: Subscription!
  }

  # extend schema {
  #   # query: RootQuery
  #   subscription: Subscription
  # }
`;

module.exports = typeDefs;
