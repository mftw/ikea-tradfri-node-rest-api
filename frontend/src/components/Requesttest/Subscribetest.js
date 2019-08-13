import React from "react";
// import { useQuery as useQueryDepc } from "react-apollo-hooks";
import { useSubscription } from "@apollo/react-hooks";
// import {  } from "apollo-client"

// import { compose, graphql,  } from 'react-apollo'

// import {} from "graphql"
// import { client } from "../../";
// import { } from "apollo-client"
import gql from "graphql-tag";

// REST Request
// const postTitleQuery = gql`
//   query postTitle {
//     post @rest(type: "news" path: "/") {
//       id
//       title
//       content
//     }
//   }
// `;

// const newsQuery = gql`
//   query {
//     news {
//       id
//       title
//       content
//       date_start
//     }
//   }
// `

// const COMMENTS_SUBSCRIPTION = gql`
//   subscription onCommentAdded($repoFullName: String!) {
//     commentAdded(repoFullName: $repoFullName) {
//       id
//       content
//     }
//   }
// `;

// const lala = {
//   payload: {
//     variables: { },
//     extensions: { },
//     operationName: null,
//     query: "subscription { heartbeat } "
//   }
// }

// const HEARTBEAT_QUERY = gql`
//   query {
//     test {
//       title

//     }
//   }
// `;

const HEARTBEAT_SUBSCRIPTION = gql`
  subscription {
    heartbeat
  }
`;

// const JOKE_SUBSCRIPTION
// = gql`
//   subscription {
//     joke
//   }
// `;

export default function Subcribe() {
  // console.log("TCL: HEARTBEAT_SUBSCRIPTION", HEARTBEAT_SUBSCRIPTION)
  const { data, loading, error } = useSubscription(HEARTBEAT_SUBSCRIPTION);
  console.log("TCL: Subcribe -> data", data);
  // const {
  //   data: joke,
  //   loading: jokeLoading,
  //   error: jokeError
  // } = useSubscription(JOKE_SUBSCRIPTION);
  // }  = useQuery(HEARTBEAT_QUERY, );

  // useSubscription(HEARTBEAT_SUBSCRIPTION);
  // console.log("TCL: data", data)
  // console.log("TCL: error", error)
  // const { heartbeat } = data;
  return (
    <>
      <div>{error && "SUBERROR " + error.message}</div>
      {/* <div>{jokeError && "JOKEERROR " + jokeError.message }</div> */}
      <div>hb {data ? <pre>{JSON.stringify(data, null, 2)}</pre> : null}</div>
      {/* <div>joke {joke ? <pre>{JSON.stringify(joke, null, 2)}</pre>  : null}</div> */}
    </>
  );
  // return <h4>New comment: {!loading && heartbeat && heartbeat.content}</h4>;
}
