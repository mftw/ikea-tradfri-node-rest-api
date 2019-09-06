const { PubSub } = require("graphql-subscriptions");
// import { PubSub } from "graphql-subscriptions";

const pubsub = new PubSub();

// ... Later in your code, when you want to publish data over subscription, run:

// const payload = {
//   commentAdded: {
//     id: "1",
//     content: "Hello!",
//   },
// };

// pubsub.publish("commentAdded", payload);

module.exports = pubsub;
