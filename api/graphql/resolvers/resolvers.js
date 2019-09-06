// const { getJokeAxios } = require('./datasources/jokeData');
// const { deviceData, groupData } = require("../../../lib/DummyData/index");
const remoteResolver = require("./remote");
const groupResolver = require("./group");
const lightbulbResolver = require("./lightbulb");

module.exports = {
  // News: async (parent, args, context, info) => {
  // const { from, to, reverse } = args;
  // news: async (_, { pageSize = 20, after }, { dataSources }) => {
  RootQuery: {
    test: async (_, _args, { pubsub }) => {
      pubsub.publish("heartbeat", { heartbeat: new Date() });
      return {
        title: "tester!",
        id: Math.round(Math.random() * 100),
        content: "lalalalalal",
      };
    },
    ...groupResolver,
    ...lightbulbResolver,
    ...remoteResolver,
  },
  Subscription: {
    heartbeat: {
      // subscribe: () => pubsub.asyncIterator("heartbeat"),
      // subscribe: (_, __, { pubsub }) => pubsub.publish("HEARTBEAT", { heartbeat: new Date() }),
      subscribe: (_, __, context) => {
        return context.pubsub.asyncIterator("heartbeat");
      },
    },
  },
};

// Payload Transformation
// When using subscribe field, it's also possible to manipulate the event payload before running it through the GraphQL execution engine.

// Add resolve method near your subscribe and change the payload as you wish:

// const rootResolver = {
//     Subscription: {
//         commentAdded: {
//           resolve: (payload) => {
//             return {
//               customData: payload,
//             };
//           },
//           subscribe: () => pubsub.asyncIterator('commentAdded')
//         }
//     },
// };
