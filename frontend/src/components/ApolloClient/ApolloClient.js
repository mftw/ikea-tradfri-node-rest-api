import { persistCache } from "apollo-cache-persist";
import React from "react";
// import { ApolloProvider, Query } from 'react-apollo';
// import gql from 'graphql-tag';

import { ApolloClient } from "apollo-client";
import { ApolloProvider as ApolloProviderHooks } from "@apollo/react-hooks";
import { ApolloLink, split } from "apollo-link";
import { InMemoryCache } from "apollo-cache-inmemory";
// import { RestLink,  } from "apollo-link-rest";
import { getMainDefinition } from "apollo-utilities";
import { HttpLink } from "apollo-link-http";
import { WebSocketLink } from "apollo-link-ws";

// import { HttpLink } from "apollo-link-http";
import { onError } from "apollo-link-error";
// import gql from "graphql-tag"
// import RequestTest from "../Requesttest/Requesttest";
// import JokeContainer from "../Requesttest/JokeContainer";

// const httpLink = createHttpLink({ uri: "/graphql" });
const httpLink = new HttpLink({
  uri: "http://localhost:3500",
});

// setup your `RestLink` with your endpoint
// const restLink = new RestLink({
//   uri: "https://heka2.apache.techcollege.dk/api",
//   // uri: "http://localhost:4000",
// });

// Create WebSocket client
const wsClient = new WebSocketLink({
  // uri: `ws://localhost:2500/subscriptions`,
  uri: `ws://localhost:3500/graphql`,
  // uri: "http://localhost:4000",
  options: {
    reconnect: true,
    // timeout: 30000,
  },
  // connectionParams: {
  //     // Pass any arguments you want for initialization
  // }
});

// Set up your cache.
const cache = new InMemoryCache();

// Set up cache persistence.
persistCache({
  cache,
  storage: window.localStorage,
  debug: true,
  // trigger: (w) => console.log("trigger",w)
});
// const logoutLink = onError(({ networkError }) => {
//   // if (networkError.statusCode === 401) logout();
//   console.log("TCL: logoutLink -> networkError", networkError)
// });

const hasSubscriptionOperation = ({ query }) => {
  // console.log("TCL: hasSubscriptionOperation -> query", query)
  const { kind, operation } = getMainDefinition(query);
  return kind === "OperationDefinition" && operation === "subscription";
};

const link = split(
  hasSubscriptionOperation,
  wsClient, // Websocket First
  httpLink
  // restLink,
);

const errorHandlerLink = ApolloLink.from([
  onError(stuff => {
    // console.log("TCL: stuff", stuff)
    const { graphQLErrors, networkError } = stuff;
    // console.log("ERROR!!!!!!!");
    if (graphQLErrors)
      graphQLErrors.map(({ message, locations, path }) =>
        console.log(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
        )
      );
    if (networkError) console.log(`[Network error]: ${networkError}`);
  }),
  link,
]);
export const client = new ApolloClient({
  // link: logoutLink.concat(restLink),
  // link: restLink,
  // link: link,
  link: errorHandlerLink,
  // link: wsClient,
  // link: httpLink,
  // uri: "https://heka2.apache.techcollege.dk/api",
  cache: cache,
  // timeout: 30000,
  // networkInterface: networkInterfaceWithSubscriptions,
  // headers: {
  // // authorization: localStorage.getItem("token"),

  // },
});

const ApiContext = props => {
  return (
    <ApolloProviderHooks client={client}>{props.children}</ApolloProviderHooks>
  );
};
export default ApiContext;
