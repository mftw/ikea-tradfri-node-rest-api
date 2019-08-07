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
import { requestSender } from "../../../lib/js/helpers/network";
import db from "../../../lib/js/db/db";
// import Icon from "../../Icon/Icon";
import styles from "./Remote.module.scss";

/**
 * TODO: Make the component fully compatible with lowdb
 *
 */

const toggleOnClick = async bulbId => {
  const data = {
    group: "" + bulbId,
  };
  return requestSender("rooms/set-group", data)
    .then(req => req.json())
    .then(req => {
      console.log(req);
      return req;
    });
  //Send request to server and toggle group
};

const Remote = props => {
  const {
    topPlacement,
    leftPlacement,
    remoteId,
    name,
    movable,
    // classes,
    // containerSize,
    reset,
    resetCallback,
  } = props;

  const styling = {};
  if (topPlacement) styling.top = topPlacement;
  if (leftPlacement) styling.left = leftPlacement;
  if (topPlacement || leftPlacement) {
    styling.position = "absolute";
    styling.transform = "translate(-50%, -50%)";
  }
  const lastLocalXY = useRef([0, 0]);

  function setLocalStorageXY(cords, id) {
    window.localStorage.setItem("" + id, JSON.stringify(cords));
    db.get("devices")
      .find(device => id in device)
      .assign({ cords })
      .write();
  }
  // const [{ x, y }, setSpring] = useSpring(() => ({ x: 0, y: 0 }));
  const [{ x, y }, setSpring] = useSpring(() => ({ x: 0, y: 0 }));
  const bind = useGesture(animation => {
    const {
      delta: [xDelta, yDelta],
      // eslint-disable-next-line
      // direction: [xDir, yDir],
      // down,
      last,
      cancel,
    } = animation;

    setSpring(() => {
      if (!movable) {
        cancel();
      } else {
        const [lastLocalX, lastLocalY] = lastLocalXY.current;
        let x = xDelta + lastLocalX;
        let y = yDelta + lastLocalY;

        if (last) {
          void setLocalStorageXY([x, y], remoteId);
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
    const localStorageXYJSON = window.localStorage.getItem("" + remoteId);
    // const localStorageXY = db
    //   .get("devices")
    //   .find(device => "" + remoteId in device)
    //   .value().cords;

    if (localStorageXYJSON) {
      const localStorageXY = JSON.parse(localStorageXYJSON);
      lastLocalXY.current = localStorageXY;
      setSpring(() => ({
        x: localStorageXY[0],
        y: localStorageXY[1],
        // Using duration cancels all physics cus ain't nobody got time for that, at mount
        // disable to get nice animation of bulbs floating into position
        config: { duration: 1 },
      }));
    }
  }, [remoteId, setSpring]);

  useEffect(() => {
    if (reset) {
      setSpring(() => ({ x: 0, y: 0, config: config.stiff }));
      lastLocalXY.current = [0, 0];
      window.localStorage.removeItem("" + remoteId);
      resetCallback();
    }
  }, [reset, setSpring, remoteId, resetCallback]);

  const text = name ? name : remoteId;

  const xyTranslate = interpolate(
    [x, y],
    (xTranslate, yTranslate) => `translate3d(${xTranslate}px,${yTranslate}px,0)`
  );

  function handleOnClick() {
    if (!movable) toggleOnClick(remoteId);
  }

  return (
    <animated.div
      {...bind()}
      onClick={handleOnClick}
      className={styles.remote}
      style={{
        transform: xyTranslate,
      }}
    >
      <svg
        enableBackground="new 0 0 512 512"
        version="1.1"
        viewBox="0 0 512 512"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="m437.05 437.05c-100.02 99.928-262.09 99.928-362.11 0l81.126-81.125c55.231 55.086 144.62 55.086 199.86 0l81.125 81.125z"
          fill="#808080"
        />
        <g fill="#b3b3b3">
          <path d="m512 256c0.109 67.92-26.864 133.08-74.946 181.05l-81.125-81.125c55.086-55.231 55.086-144.62 0-199.86l81.125-81.126c48.082 47.972 75.055 113.13 74.946 181.05z" />
          <path d="m114.76 256c-0.042 37.473 14.821 73.425 41.313 99.928l-81.126 81.125c-99.928-100.02-99.928-262.09 0-362.11l81.126 81.126c-26.492 26.504-41.355 62.456-41.313 99.929z" />
        </g>
        <path
          d="m437.05 74.946-81.125 81.126c-55.231-55.086-144.62-55.086-199.86 0l-81.125-81.126c100.02-99.927 262.09-99.927 362.11 0z"
          fill="#808080"
        />
        <path
          d="m397.24 256c-0.09 67.277-47.679 125.13-113.68 138.18s-132.03-22.308-157.74-84.481-3.923-133.84 52.028-171.2 130.5-30.002 178.07 17.57c26.493 26.504 41.356 62.456 41.314 99.929z"
          fill="#999"
        />
        <g fill="#fff">
          <path d="m256 300.14c-15.77 3e-3 -30.344-8.409-38.23-22.066s-7.887-30.484-2e-3 -44.141c1.566-2.754 4.487-4.458 7.655-4.464 3.168-7e-3 6.096 1.684 7.674 4.431s1.563 6.129-0.039 8.861c-6.407 11.131-3.904 25.255 5.938 33.506s24.186 8.251 34.028 0 12.345-22.375 5.938-33.506c-1.74-2.736-1.839-6.206-0.259-9.038 1.58-2.831 4.586-4.569 7.828-4.525s6.199 1.862 7.703 4.735c7.885 13.658 7.884 30.484-2e-3 44.141s-22.461 22.069-38.232 22.066z" />
          <path d="m256 247.17c-4.875 0-8.828-3.952-8.828-8.828v-17.654c0-4.875 3.952-8.828 8.828-8.828s8.828 3.952 8.828 8.828v17.655c0 4.875-3.952 8.827-8.828 8.827z" />
          <path d="m441.72 282.48c-3.602 0-6.844-2.189-8.189-5.53-1.346-3.342-0.526-7.166 2.072-9.662l11.793-11.291-12.023-11.185c-3.471-3.336-3.629-8.839-0.355-12.368 3.274-3.53 8.773-3.785 12.36-0.573l16.772 15.528c2.349 2.143 3.703 5.165 3.74 8.344s-1.247 6.231-3.545 8.428l-16.499 15.89c-1.653 1.566-3.848 2.433-6.126 2.419z" />
          <path d="m70.276 282.48c-2.281 0-4.473-0.882-6.118-2.463l-16.49-15.828c-2.302-2.193-3.59-5.243-3.559-8.423 0.032-3.179 1.381-6.203 3.726-8.35l16.772-15.528c2.301-2.211 5.615-3.008 8.67-2.086 3.055 0.923 5.373 3.422 6.065 6.537 0.691 3.115-0.352 6.361-2.729 8.489l-12.013 11.169 11.794 11.335c2.565 2.501 3.364 6.304 2.023 9.626-1.342 3.322-4.559 5.503-8.141 5.522z" />
          <path d="m256 476.69c-14.626 0-26.483-11.857-26.483-26.483s11.857-26.483 26.483-26.483 26.483 11.857 26.483 26.483-11.856 26.483-26.483 26.483zm0-35.311c-4.875 0-8.828 3.952-8.828 8.828s3.952 8.828 8.828 8.828 8.828-3.952 8.828-8.828-3.952-8.828-8.828-8.828z" />
          <path d="m256 88.276c-14.626 0-26.483-11.857-26.483-26.483s11.857-26.483 26.483-26.483 26.483 11.857 26.483 26.483-11.856 26.483-26.483 26.483zm0-35.311c-4.875 0-8.828 3.952-8.828 8.828s3.952 8.828 8.828 8.828 8.828-3.952 8.828-8.828-3.952-8.828-8.828-8.828z" />
        </g>
      </svg>
      <span>{text}</span>
    </animated.div>
  );
};

export default Remote;

Remote.defaultProps = {
  reset: false,
  resetCallback: () => {}, // noop
};

Remote.propTypes = {
  topPlacement: PropTypes.string,
  leftPlacement: PropTypes.string,
  remoteId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  name: PropTypes.string,
  reset: PropTypes.bool,
  resetCallback: PropTypes.func,
};
