import React from 'react'
import posed from "react-pose";
import styled from "styled-components";
// import { useQuery as useQueryDepc } from "react-apollo-hooks";

const Div = styled(posed.article({
  enter: {},
  exit: {}
}))



export default function Joke(props) {
  // }  = useQuery(HEARTBEAT_QUERY , );
  const {jokeData } = props;
  console.log("TCL: jokeData", jokeData.joke)
  
  
  // useSubscription(HEARTBEAT_SUBSCRIPTION);
  // console.log("TCL: data", data)
  // console.log("TCL: error", error)
  // const { heartbeat } = data;
  return (
    <Div key="joke-div">
      <p>{jokeData.joke || ""}</p>
    </Div>
  );
  // return <h4>New comment: {!loading && heartbeat && heartbeat.content}</h4>;
}