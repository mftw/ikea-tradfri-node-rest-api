import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import {
  // useSprings,
  interpolate,
  useSpring,
  animated,
  config,
} from "react-spring";
import { useGesture } from "react-use-gesture";
import Icon from "../../Icon/Icon";
import styles from "./LightBulb.module.scss";

const LightBulb = props => {
  const {
    topPlacement,
    leftPlacement,
    bulbId,
    clicked,
    name,
    editMode,
    containerSize,
  } = props;

  const styling = {};
  if (topPlacement) styling.top = topPlacement;
  if (leftPlacement) styling.left = leftPlacement;
  if (topPlacement || leftPlacement) {
    styling.position = "absolute";
    styling.transform = "translate(-50%, -50%)";
  }
  const thisLight = useRef(null);
  const lastLocalXY = useRef([0, 0]);

  function setLocalStorageXY(cords, id) {
    console.log(cords);
    window.localStorage.setItem("" + id, JSON.stringify(cords));
  }
  console.log(lastLocalXY.current[0], lastLocalXY.current[1]);
  const [{ x, y }, setSpring] = useSpring(() => ({ x: 0, y: 0 }));
  const bind = useGesture(animation => {
    const {
      delta: [xDelta, yDelta],
      // eslint-disable-next-line
      // direction: [xDir, yDir],
      down,
      last,
      cancel,
    } = animation;

    setSpring(() => {
      if (!editMode) {
        cancel();
      } else {
        let x = xDelta + lastLocalXY.current[0];
        let y = yDelta + lastLocalXY.current[1];
        // let x = xDelta + llY;
        // let y = yDelta + llX;

        if (last) {
          setLocalStorageXY([x, y], bulbId);
          lastLocalXY.current = [x, y];
        }
        return {
          x,
          y,
          config: config.stiff,
        };
      }
    });
  });

  useEffect(() => {
    const localStorageXYJSON = window.localStorage.getItem(bulbId);
    let timer = 500;
    if (
      localStorageXYJSON
      // &&
      // lastLocalXY.current[0] + lastLocalXY.current[1] === 0
    ) {
      // console.log(JSON.parse(localStorageXY));
      const localStorageXY = JSON.parse(localStorageXYJSON);

      // timer = setTimeout(() => {
      // }, timer);
      lastLocalXY.current = localStorageXY;
      setSpring(() => ({
        x: localStorageXY[0],
        y: localStorageXY[1],
        config: { duration: 1 },
      }));
    }
    return () => {
      clearTimeout(timer);
    };
  }, [bulbId, setSpring]);
  const text = name ? name : bulbId;
  // const yTranslate = y.interpolate(y => `translate3d(0,${y}px,0)`);
  // const xTranslate = x.interpolate(x => `translate3d(${x}px,0,0)`);

  const xyTranslate = interpolate(
    [x, y],
    (xTranslate, yTranslate) => `translate3d(${xTranslate}px,${yTranslate}px,0)`
  );

  // const rotateX = y.interpolate({
  //   map: Math.abs,
  //   range: [-startingPoint, halfContainerHeight],
  //   // output: ["scale(1,1)", "scale(1,-1)"],
  //   output: ["rotateX(-90deg)", "rotateX(0deg)"],
  //   extrapolate: "clamp",
  // });

  function handleOnClick() {
    if (!editMode) clicked(bulbId);
  }

  return (
    <animated.div
      {...bind()}
      onClick={handleOnClick}
      className={styles.lightBulb}
      style={{
        transform: xyTranslate,
      }}
      ref={thisLight}
    >
      <svg
        enableBackground="new 0 0 512.022 512.022"
        version="1.1"
        viewBox="0 0 512.02 512.02"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g transform="translate(-1)">
          <path
            d="m362.25 434.9c33.525-50.56 31.641-95.082 31.637-101.75 0.124-53.62-23.781-104.48-65.148-138.59-25.475-21.542-40.008-53.327-39.636-86.687v-26.13c5e-3 -6.111-4.924-11.079-11.034-11.123h-121.47c-6.11 0.044-11.039 5.012-11.034 11.123v26.924c0.508 32.77-13.717 64.037-38.753 85.186-55.607 45.276-78.905 119.32-59.24 188.28s78.511 119.58 149.64 128.72c46.189 5.373 114.99-6.553 165.04-75.952"
            fill="#f3d55b"
          />
          <path
            d="m243.82 132.41h-52.966c-4.875 0-8.828-3.952-8.828-8.828 0-4.875 3.952-8.828 8.828-8.828h52.966c4.875 0 8.828 3.952 8.828 8.828-1e-3 4.876-3.953 8.828-8.828 8.828z"
            fill="#F18D46"
          />
          <path
            d="m190.85 0h52.966c19.501 0 35.31 15.809 35.31 35.31v35.31h-123.59v-35.31c0-19.501 15.809-35.31 35.31-35.31z"
            fill="#BDC3C7"
          />
          <path
            d="M203.042,0h28.593c16.477,0.005,29.832,13.361,29.837,29.837v40.783h-88.276V29.837   C173.201,13.357,186.562,0,203.042,0z"
            fill="#D1D4D1"
          />
          <g fill="#F9EAB0">
            <path d="m102.58 308.97c-0.488-2e-3 -0.975-0.043-1.457-0.124-2.31-0.385-4.372-1.672-5.733-3.577-1.361-1.906-1.909-4.274-1.523-6.583 6.588-35.114 27.219-66.018 57.123-85.566 4.178-2.516 9.605-1.168 12.12 3.01 2.516 4.178 1.168 9.605-3.01 12.12-25.352 17.009-42.914 43.388-48.825 73.34-0.707 4.253-4.383 7.373-8.695 7.38z" />
            <path d="m102.58 353.1c-4.875 0-8.828-3.952-8.828-8.828v-8.828c0-4.875 3.952-8.828 8.828-8.828 4.875 0 8.828 3.952 8.828 8.828v8.828c0 4.876-3.952 8.828-8.828 8.828z" />
          </g>
          <g
            className="exclamationCircle"
            transform="translate(-34.121 -9.3612)"
          >
            <circle cx="393.89" cy="432.55" r="79.448" fill="#d25627" />
            <g fill="#fff">
              <path d="m393.89 450.21c-4.875 0-8.828-3.952-8.828-8.828v-52.966c0-4.875 3.952-8.828 8.828-8.828s8.828 3.952 8.828 8.828v52.966c-1e-3 4.876-3.953 8.828-8.828 8.828z" />
              <path d="m393.89 485.52c-4.875 0-8.828-3.952-8.828-8.828v-8.828c0-4.875 3.952-8.828 8.828-8.828s8.828 3.952 8.828 8.828v8.828c-1e-3 4.876-3.953 8.828-8.828 8.828z" />
            </g>
          </g>
        </g>
      </svg>
      {!!text && <span>{text}</span>}
    </animated.div>
  );
};

export default LightBulb;

LightBulb.propTypes = {
  topPlacement: PropTypes.string,
  leftPlacement: PropTypes.string,
};
