const { ApolloServer } = require("apollo-server-express");
const pubsub = require("../../lib/pubSub");
const typeDefs = require("./schema/index");
const resolvers = require("./resolvers/resolvers");
const Tradfri = require("../../lib/tradfri/instance");
require("./subscription-events/group");
// const ikeaSub = require("./ikeaSubscriptions");

// Apollo's defualt endpoint is /graphql, dunno how to change it, and doesn't care
const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  // dataSources,
  cacheControl: {
    defaultMaxAge: 0,
  },
  context: ({ req, res }) => ({ req, res, pubsub, tradfri: Tradfri }),
});

setInterval(() => {
  // console.log(
  //   "dong dong" +
  //     Math.random()
  //       .toString()
  //       .slice(0, 5)
  // );
  pubsub.publish("heartbeat", {
    heartbeat: "server time: " + new Date().toString(),
  });
}, 1000);

const curGroupsOnOff = [];
(async () => {
  const localTradfri = await Tradfri;
  for (const group in localTradfri.groups) {
    curGroupsOnOff.push({
      id: group,
      name: localTradfri.groups[group].group.name,
      onOff: localTradfri.groups[group].group.onOff,
    });
  }
  console.log(curGroupsOnOff);
})();
// setInterval(() => {
//   (async () => {
//     const localTradfri = await Tradfri;
//     for (const group in localTradfri.groups) {
//     }
//   })();
// }, 1000);

module.exports = apolloServer;
