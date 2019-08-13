import React, {useEffect, useState, useCallback} from 'react'
// import { useQuery } from "react-apollo-hooks";
import { useQuery } from "@apollo/react-hooks";
import { client } from "../ApolloClient/ApolloClient";
// import { } from "apollo-client"
import gql from "graphql-tag";

const newsQuery = gql`
  query {
    news {
      id
      title
      content
      date_start
    }
  }
`

export default function RequestTest(props) {
  const stuff = useQuery(newsQuery, 
    {
    fetchPolicy: "network-only",
    client: client,
  }
  );

  const { data, loading, error, refetch, } = stuff;

  const [fetchedData, setFetchedData] = useState(null);
  const getCache = useCallback(() => {
    client
      .query({
        query: newsQuery,
      })
      .then(data => {
        console.log("TCL: printClient -> data", data.data.news);
        setFetchedData(data.data.news);
      })

      .catch(error => console.error(error));
    return;
  }, [setFetchedData]);

  useEffect(() => {
    if(data) {
      const dataKeys = Object.keys(data);
      if(dataKeys.length === 0) {
        getCache();
      }
    }
  }, [data, getCache, error])

  

  function printClient(e) {
    getCache();
    console.log("TCL: printClient -> client", client)
  }

  // if (error) return error.message;
  if (loading) return "we are loading"
  return (
    <div>
      <button onClick={() => refetch()}>refetch</button>
      <button onClick={printClient}>printClient</button>
      <button onClick={() => window.location.reload()}>reload page</button>
      <button onClick={() => window.location.reload()}>reload page</button>
      {error && (
        <pre>
        <h1>"WARNING! - OFFLINE DATA"</h1>
        <h2>{JSON.stringify(error, null, 2)}</h2>

        </pre>
      )}
      <pre>
        {JSON.stringify(fetchedData, null, 2)}
      </pre>
    </div>
  )
}