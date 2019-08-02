import React, { useRef, useEffect, useState, useCallback } from "react";
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
import styles from "./Masterswitch.module.scss";

/**
 * TODO: Make the component fully compatible with lowdb
 *
 */

const ChildIcon = React.forwardRef((props, ref) => {
  console.log("TCL: props", props);
  return (
    <animated.div
      // style={{
      //   opacity: springOpacity.interpolate(val => val),
      //   // opacity: interOpacity,
      //   // opacity: holdTrigger ? 1 : 0,
      //   // transition: "opacity 0.3s ease",
      // }}
      {...props}
      ref={ref}
      // className={styles.chilIcon}
    >
      <svg
        enableBackground="new 0 0 512 512"
        version="1.1"
        viewBox="0 0 512 512"
        xmlns="http://www.w3.org/2000/svg"
        style={styles.childIconSvg}
      >
        <circle cx="256" cy="256" r="225" fill="#ff5364" strokeWidth="2.832" />
        <g
          transform="matrix(1.761 0 0 1.761 -194.83 -334.1)"
          fill="#fff"
          strokeWidth="1.6082"
        >
          <path d="m256 406.08c-25.362 5e-3 -48.8-13.524-61.483-35.487s-12.684-49.025-3e-3 -70.989c3.9466-6.7321 12.588-9.0174 19.345-5.1142 6.7578 3.9016 9.0994 12.528 5.2428 19.312-10.304 17.901-6.2785 40.616 9.5497 53.885 15.828 13.27 38.897 13.27 54.725 0s19.854-35.984 9.5497-53.885c-3.8566-6.7835-1.515-15.41 5.2428-19.312 6.7578-3.9016 15.399-1.6179 19.345 5.1142 12.684 21.968 12.679 49.037-0.01 71.002-12.691 21.965-36.139 35.489-61.505 35.474z" />
          <path d="m256 320.9c-7.8401 0-14.197-6.3557-14.197-14.197v-28.393c0-7.8401 6.3557-14.197 14.197-14.197s14.197 6.3557 14.197 14.197v28.393c0 7.8401-6.3574 14.197-14.197 14.197z" />
        </g>
      </svg>
    </animated.div>
  );
});

function useOutsideAlerter(initialIsVisible) {
  const [isComponentClicked, setIsComponentVisible] = useState(
    initialIsVisible
  );
  const ref = useRef(null);

  const handleClickOutside = event => {
    // event.preventDefault();
    if (ref.current && !ref.current.contains(event.target)) {
      setIsComponentVisible(false);
    } else if (ref.current && ref.current.contains(event.target)) {
      setIsComponentVisible(true);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside, true);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside, true);
    };
  });

  return { ref, isComponentClicked, setIsComponentVisible };
}

const toggleOnClick = async bulbId => {
  const data = {
    confirmation: true,
  };
  return requestSender("masterswitch", data)
    .then(req => req.json())
    .then(req => {
      console.log(req);
      return req;
    });
  //Send request to server and toggle group
};

const Masterswitch = props => {
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
  // const holdTime = 1000;
  const holdTimer = useRef(false);
  const skipNextClickEvent = useRef(false);

  const resetHoldTimer = useCallback(() => {
    if (holdTimer.current !== false) {
      clearTimeout(holdTimer.current);
      holdTimer.current = false;
    }
  }, [holdTimer]);
  // const [holdTrigger, setHoldTrigger] = useState(false);
  const triggerRef = useRef(false);
  const { ref, isComponentClicked } = useOutsideAlerter(true);
  const [
    { xCordsChildren, yCordsChildren },
    setTransformChildSpring,
  ] = useSpring(() => ({
    // opacity: 0,
    // from: { opacity: 1 },
    // transform: "translate3d(0,0,0)",
    // transform: "translate3d(120%,120%,0)",
    // from: { transform: "translate3d(0,0,0)" },
    xCordsChildren: 0,
    yCordsChildren: 0,
  }));

  // const [{ x, y }, setSpring] = useSpring(() => ({ x: 0, y: 0 }));
  const [{ x, y }, setMoveSpring] = useSpring(() => ({
    x: 0,
    y: 0,
  }));

  const holdTime = 500;
  const touchStart = useRef(false);
  const bind = useGesture(animation => {
    const {
      delta: [xDelta, yDelta],
      // eslint-disable-next-line
      // direction: [xDir, yDir],
      moving,
      down,
      last,
      cancel,
    } = animation;

    setMoveSpring(() => {
      if (down && !moving && xDelta === 0 && yDelta === 0) {
        if (!touchStart.current) {
          holdTimer.current = setTimeout(() => {
            handleTriggerToggle();
            skipNextClickEvent.current = true;
          }, holdTime);
        }
        touchStart.current = true;
      }
      if (down && xDelta !== 0 && yDelta !== 0) {
        resetHoldTimer();
        handleTriggerOff();
      }
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

  // effect to look for coordinates in localstorage
  useEffect(() => {
    const localStorageXYJSON = window.localStorage.getItem("" + remoteId);
    // const localStorageXY = db
    //   .get("devices")
    //   .find(device => "" + remoteId in device)
    //   .value().cords;

    if (localStorageXYJSON) {
      const localStorageXY = JSON.parse(localStorageXYJSON);
      lastLocalXY.current = localStorageXY;
      setMoveSpring(() => ({
        x: localStorageXY[0],
        y: localStorageXY[1],
        // Using duration cancels all physics cus ain't nobody got time for that, at mount
        // disable to get nice animation of bulbs floating into position
        config: { duration: 1 },
      }));
    }
  }, [remoteId, setMoveSpring]);

  // effect to reset the remotes positon
  useEffect(() => {
    if (reset) {
      setMoveSpring(() => ({ x: 0, y: 0, config: config.stiff }));
      lastLocalXY.current = [0, 0];
      window.localStorage.removeItem("" + remoteId);
      resetCallback();
    }

    return () => resetHoldTimer();
  }, [
    reset,
    setMoveSpring,
    remoteId,
    resetCallback,
    holdTimer,
    resetHoldTimer,
  ]);

  // effect to reset the holdtrigger
  useEffect(() => {
    if (!isComponentClicked && triggerRef.current === true) {
      triggerRef.current = false;
      setTransformChildSpring(() => ({
        // transform: "translate3d(0,0,0)",
        xCordsChildren: 0,
        yCordsChildren: 0,
        // from: { transform: "translate3d(120%,120%,0)", },
      }));
    }
  }, [isComponentClicked, triggerRef, setTransformChildSpring]);

  const text = name ? name : remoteId;

  const xyTranslate = interpolate(
    [x, y],
    (xTranslate, yTranslate) => `translate3d(${xTranslate}px,${yTranslate}px,0)`
  );

  function handleOnClick() {
    const nextClickSkip = skipNextClickEvent.current;
    if (
      !movable &&
      holdTimer.current === false &&
      !touchStart.current &&
      !nextClickSkip
    ) {
      toggleOnClick(remoteId);
    }
    if (nextClickSkip) {
      skipNextClickEvent.current = false;
    }
  }

  function handleTriggerToggle(e) {
    // setHoldTrigger(!holdTrigger);
    if (triggerRef.current) {
      handleTriggerOff();
    } else {
      handleTriggerOn();
    }
  }
  function handleTriggerOn(e) {
    triggerRef.current = true;
    // setTransformChildSpring(() => ({
    //   opacity: 1,
    // }));
    setTransformChildSpring(() => ({
      // transform: "translate3d(0,0,0)",
      // transform: "translate3d(120%,120%,0)",
      xCordsChildren: 120,
      yCordsChildren: 120,
      // from: { transform: "translate3d(120%,120%,0)", },
    }));
    // setHoldTrigger(true);
  }
  function handleTriggerOff(e) {
    triggerRef.current = false;
    setTransformChildSpring(() => ({
      xCordsChildren: 0,
      yCordsChildren: 0,
      // transform: "translate3d(0,0,0)",
      // transform: "translate3d(120%,120%,0)",
      // from: { transform: "translate3d(120%,120%,0)", },
    }));
    // setTransformChildSpring(() => ({
    //   opacity: 0,
    // }));
  }

  function handleDoubleClick(e) {
    handleTriggerToggle();
  }

  function handlePointerLeave() {
    touchStart.current = false;
    resetHoldTimer();
  }

  // const childTranslate = interpolate(
  //   [xCordsChildren.interpolate(v => v), yCordsChildren.interpolate(v => v)],
  //   (xChs, yChs) => {
  //     console.log(`transform3d(${xChs}%, ${yChs}%,0%)`);
  //     return `translate3d(${xChs}%, ${yChs}%,0%)`;
  //   }
  // );
  // const childTranslate2 = interpolate(
  //   [xCordsChildren.interpolate(v => v)],
  //   xChs => {
  //     console.log(`transform3d(${xChs}%, ${xChs}%,0%)`);
  //     return `translate3d(${xChs}%, ${xChs}%,0%)`;
  //   }
  // );

  return (
    <animated.div
      {...bind()}
      // onDoubleClick={handleDoubleClick}
      onClick={handleOnClick}
      className={styles.remote}
      style={{
        transform: xyTranslate,
      }}
      onMouseUp={handlePointerLeave}
      onTouchEnd={handlePointerLeave}
      ref={ref}
    >
      <svg
        enableBackground="new 0 0 512 512"
        version="1.1"
        viewBox="0 0 512 512"
        xmlns="http://www.w3.org/2000/svg"
        className={styles.mainIcon}
      >
        <path
          d="m11.22 17.655h489.56c6.197 0 11.22 5.023 11.22 11.22v454.25c0 6.197-5.023 11.22-11.22 11.22h-489.56c-6.197 0-11.22-5.023-11.22-11.22v-454.25c0-6.197 5.023-11.22 11.22-11.22z"
          fill="#41767F"
        />
        <path
          d="m512 28.866v147.69h-512v-147.69c0.01-6.188 5.023-11.201 11.211-11.211h489.58c6.188 0.01 11.201 5.024 11.211 11.211z"
          fill="#2C3E50"
        />
        <path
          d="m85.168 52.966h341.66c3.159 0 5.72 2.561 5.72 5.72v76.835c0 3.159-2.561 5.72-5.72 5.72h-341.66c-3.159 0-5.72-2.561-5.72-5.72v-76.835c-1e-3 -3.159 2.56-5.72 5.72-5.72z"
          fill="#65ddb9"
        />
        <circle
          cx="256"
          cy="335.1"
          r="127.77"
          fill="#ff5364"
          strokeWidth="1.6082"
        />
        <g fill="#fff" strokeWidth="1.6082">
          <path d="m256 406.08c-25.362 5e-3 -48.8-13.524-61.483-35.487s-12.684-49.025-3e-3 -70.989c3.9466-6.7321 12.588-9.0174 19.345-5.1142 6.7578 3.9016 9.0994 12.528 5.2428 19.312-10.304 17.901-6.2785 40.616 9.5497 53.885 15.828 13.27 38.897 13.27 54.725 0 15.828-13.27 19.854-35.984 9.5497-53.885-3.8566-6.7835-1.515-15.41 5.2428-19.312 6.7578-3.9016 15.399-1.6179 19.345 5.1142 12.684 21.968 12.679 49.037-0.01 71.002-12.691 21.965-36.139 35.489-61.505 35.474z" />
          <path d="m256 320.9c-7.8401 0-14.197-6.3557-14.197-14.197v-28.393c0-7.8401 6.3557-14.197 14.197-14.197s14.197 6.3557 14.197 14.197v28.393c0 7.8401-6.3574 14.197-14.197 14.197z" />
        </g>
        <text
          x="255.75586"
          y="112.01561"
          fill="#000000"
          textAnchor="middle"
          xmlSpace="preserve"
        >
          <tspan x="255.75586" y="112.01561">
            {text ? text : "Masterswitch"}
          </tspan>
        </text>
      </svg>

      {/* <ChildIcon
        style={{
          // opacity: transform.interpolate(val => val),
          // opacity: interOpacity,
          // opacity: holdTrigger ? 1 : 0,
          // transition: "opacity 0.3s ease",
          // transform: childTranslate,
          transform: xCordsChildren.interpolate(xCordC => {
            return `translate3d(${xCordC}px, ${xCordC}px,0px)`;
          }),
        }}
        className={styles.childIcon}
      /> */}
      <animated.section
        style={{
          // opacity: transform.interpolate(val => val),
          // opacity: interOpacity,
          // opacity: holdTrigger ? 1 : 0,
          // transition: "opacity 0.3s ease",
          // transform: childTranslate2,
          transform: xCordsChildren.interpolate(xCordC => {
            return `translate3d(${xCordC}px, ${xCordC}px,0px)`;
          }),
        }}
        className={styles.childIcon}
        onMouseDown={e => e.stopPropagation()}
        onTouchStart={e => e.stopPropagation()}
        onClick={e => e.stopPropagation()}
      >
        <svg
          enableBackground="new 0 0 512 512"
          version="1.1"
          viewBox="0 0 512 512"
          xmlns="http://www.w3.org/2000/svg"
          className={styles.childIconSvg}
        >
          <circle
            cx="256"
            cy="256"
            r="225"
            fill="#ff5364"
            strokeWidth="2.832"
          />
          <g
            transform="matrix(1.761 0 0 1.761 -194.83 -334.1)"
            fill="#fff"
            strokeWidth="1.6082"
          >
            <path d="m256 406.08c-25.362 5e-3 -48.8-13.524-61.483-35.487s-12.684-49.025-3e-3 -70.989c3.9466-6.7321 12.588-9.0174 19.345-5.1142 6.7578 3.9016 9.0994 12.528 5.2428 19.312-10.304 17.901-6.2785 40.616 9.5497 53.885 15.828 13.27 38.897 13.27 54.725 0s19.854-35.984 9.5497-53.885c-3.8566-6.7835-1.515-15.41 5.2428-19.312 6.7578-3.9016 15.399-1.6179 19.345 5.1142 12.684 21.968 12.679 49.037-0.01 71.002-12.691 21.965-36.139 35.489-61.505 35.474z" />
            <path d="m256 320.9c-7.8401 0-14.197-6.3557-14.197-14.197v-28.393c0-7.8401 6.3557-14.197 14.197-14.197s14.197 6.3557 14.197 14.197v28.393c0 7.8401-6.3574 14.197-14.197 14.197z" />
          </g>
        </svg>
      </animated.section>
    </animated.div>
  );
};

export default Masterswitch;

Masterswitch.defaultProps = {
  reset: false,
  resetCallback: () => {}, // noop
};

Masterswitch.propTypes = {
  topPlacement: PropTypes.string,
  leftPlacement: PropTypes.string,
  remoteId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  name: PropTypes.string,
  reset: PropTypes.bool,
  resetCallback: PropTypes.func,
};
