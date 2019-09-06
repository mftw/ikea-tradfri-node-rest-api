import React, { useEffect, useState, useRef } from "react";
import { useSubscription } from "@apollo/react-hooks";
import gql from "graphql-tag";

import posed from "react-pose";
import styled from "styled-components";
// import Joke from "./Joke";

const Div = styled(
  posed.div({
    // default: {
    //   height: "auto",
    //   transition: {
    //     ease: "ease-in"
    //   }
    // }
  })
)`
position: relative;
height: 10rem;
max-height: 10rem;
width: 100%;
display: flex;
justify-content: center;
align-items: center;
`;

const Joke = styled(posed.figure({
  show: {
    opacity: 1,
    // height: "auto",
    y: 0,
    scaleY: 1,
  },
  hide: {
    opacity: 0,
    // height: 0,
    y: "100%",
    scaleY: 0,
    // transition: {
    //   duration: 1000
    // },
  },
}))`
  // position: absolute;
`;

const JOKE_SUBSCRIPTION = gql`
  subscription {
    joke
  }
`;

export default function JokeContainer(props) {
  const { data, loading, error } = useSubscription(JOKE_SUBSCRIPTION);
  // const lastData = useRef({joke: ""});
  const [lastData, setLastData] = useState({joke: ""});
  // console.log("TCL: JokeContainer -> lastData", lastData)
  const renderTimer = useRef();
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    if(data) {
      // if(data.joke !== lastData.current.joke) {
      if(data.joke !== lastData.joke) {
        setShouldRender(false)
        renderTimer.current = setTimeout(() => {
          // lastData.current.joke = data.joke
          setLastData(data);
          setShouldRender(true)
        }, 500)
      }
    }

    return () => {
      clearTimeout(renderTimer.current);
    }
  }, [renderTimer, setShouldRender, lastData, setLastData, data])

  // const jokeText = lastData.current.joke ? lastData.current.joke : "";
  const jokeText = lastData.joke ? lastData.joke : "";

  return (
    <Div key="unique-JokecontainerKey" flipMove={false}>
      <Joke pose={shouldRender ? "show" : "hide"}>{jokeText}</Joke>
    </Div>
  );
}
