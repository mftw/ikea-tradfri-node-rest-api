import React, { useRef, useCallback } from "react";
import PropTypes from "prop-types";
import {
  // useSprings,
  interpolate,
  useSpring,
  animated,
  // config,
} from "react-spring";
// import { useGesture } from "react-use-gesture";
import ChildIcon from "./ChildIcon";
import { requestSender } from "../../../lib/js/helpers/network";
// import db from "../../../lib/js/db/db";
// import Icon from "../../Icon/Icon";
import {
  useOutsideAlerter,
  useGetLocalStorageCoordinates,
  useGetContainerSize,
  useResetHoldTrigger,
  useResetPos,
  useDraggable,
} from "../common/deviceHooks";
import { setLocalStorageXY } from "../common/helpers";
import styles from "./Masterswitch.module.scss";

/**
 * TODO: Make the component fully compatible with lowdb / apollo
 *
 */

/**
 * TODO: Make the component change the colors of the children
 *
 */

const childButtons = [
  {
    text: "Sluk alt",
    request: async () => requestSender("masterswitch", { confirmation: true }),
    color: "#ff5364",
  },
  {
    text: "Tænd alt",
    request: async () =>
      requestSender("masterswitch/all-on", { confirmation: true }),
    color: "#9BCF5F",
  },
  {
    text: "Sa Force",
    request: async () =>
      requestSender("masterswitch", { confirmation: true, force: true }),
    color: "#ff5364",
  },
  {
    text: "Ta Force",
    request: async () =>
      requestSender("masterswitch/all-on", { confirmation: true, force: true }),
    color: "#9BCF5F",
  },
];

const Masterswitch = props => {
  const {
    topPlacement,
    leftPlacement,
    remoteId,
    // name,
    movable,
    // classes,
    reset,
    resetCallback,
  } = props;
  // const text = name ? name : remoteId;

  const styling = {};
  if (topPlacement) styling.top = topPlacement;
  if (leftPlacement) styling.left = leftPlacement;
  if (topPlacement || leftPlacement) {
    styling.position = "absolute";
    styling.transform = "translate(-50%, -50%)";
  }
  const lastLocalXY = useRef([0, 0]);

  const holdTime = 300;

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

  const { componentRef, isComponentClicked } = useOutsideAlerter(true);

  const [
    { xCordsChildren, zIndex: topOfIconzIndex },
    setTransformChildSpring,
  ] = useSpring(() => ({
    xCordsChildren: 0,
    yCordsChildren: 0,
    zIndex: 250,
  }));

  // const [{ x, y }, setSpring] = useSpring(() => ({ x: 0, y: 0 }));
  const [{ x, y }, setMoveSpring] = useSpring(() => ({
    x: 0,
    y: 0,
    // config: config.molasses,
  }));

  const touchStart = useRef(false);
  const bind = useDraggable(
    setMoveSpring,
    touchStart,
    handleTriggerToggle,
    resetHoldTimer,
    holdTimer,
    skipNextClickEvent,
    holdTime,
    movable,
    handleTriggerOff,
    lastLocalXY,
    remoteId,
    setLocalStorageXY
  );

  useGetLocalStorageCoordinates(remoteId, lastLocalXY, setMoveSpring);

  useResetPos(
    reset,
    setMoveSpring,
    remoteId,
    resetCallback,
    holdTimer,
    resetHoldTimer,
    lastLocalXY
  );

  useResetHoldTrigger(isComponentClicked, triggerRef, setTransformChildSpring);

  // const iconSize = useRef([0, 0]);

  // useGetContainerSize(componentRef, iconSize);
  const [iconSize] = useGetContainerSize(componentRef);

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
    if (triggerRef.current) {
      handleTriggerOff();
    } else {
      handleTriggerOn();
    }
  }

  function handleTriggerOn(e) {
    triggerRef.current = true;
    setTransformChildSpring(() => ({
      xCordsChildren: 100,
      yCordsChildren: 100,
      zIndex: 500,
      // config: config.wobbly,
    }));
  }

  function handleTriggerOff(e) {
    triggerRef.current = false;
    setTransformChildSpring(() => ({
      xCordsChildren: 0,
      yCordsChildren: 0,
      zIndex: 250,
    }));
  }

  function handlePointerUp() {
    touchStart.current = false;
    resetHoldTimer();
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

  const scaleBtnInter = xCordsChildren.interpolate({
    map: Math.abs,
    range: [0, 100],
    output: ["scale(1)", "scale(1.9)"],
    // output: ["rotateX(0deg)", "rotateX(180deg)"],
    extrapolate: "clamp",
  });

  const moveBtnInter = xCordsChildren.interpolate({
    map: Math.abs,
    range: [0, 100],
    output: ["translate3d(0,0%,0)", "translate3d(0,33%,0)"],
    // output: ["rotateX(0deg)", "rotateX(180deg)"],
    extrapolate: "clamp",
  });

  const buttonAnimation = interpolate(
    [scaleBtnInter, moveBtnInter],
    (xTranslate, yTranslate) => `${xTranslate} ${yTranslate}`
  );

  const xyTranslate = interpolate(
    [x, y],
    (xTranslate, yTranslate) => `translate3d(${xTranslate}px,${yTranslate}px,0)`
  );

  return (
    <animated.div
      {...bind()}
      onClick={handleOnClick}
      className={styles.remote}
      style={{
        transform: xyTranslate,
        // borderRadius: xCordsChildren.interpolate(bRadius => `${bRadius}%`),
      }}
      onMouseUp={handlePointerUp}
      onTouchEnd={handlePointerUp}
      ref={componentRef}
    >
      <svg
        // style={{
        //   // transform: xyTranslate,
        //   borderRadius: xCordsChildren.interpolate(bRadius => `${bRadius}%`),
        // }}
        enableBackground="new 0 0 512 512"
        version="1.1"
        viewBox="0 0 512 512"
        xmlns="http://www.w3.org/2000/svg"
        className={styles.mainIcon}
      >
        <path
          d="m11.22 23.655h489.56c6.197 0 11.22 5.023 11.22 11.22v454.25c0 6.197-5.023 11.22-11.22 11.22h-489.56c-6.197 0-11.22-5.023-11.22-11.22v-454.25c0-6.197 5.023-11.22 11.22-11.22z"
          fill="#41767f"
        />
        <animated.path
          d="m11.211 11.654c-6.188 0.01-11.201 5.0229-11.211 11.211v147.69h512v-147.69h2e-3c-0.01-6.187-5.0229-11.201-11.211-11.211zm134.81 16.357 110.07 32.414 109.89-32.414v126.19h-59.973v-24.613h14.732v-59.281l-42.119 11.961v71.934h-45.24v-71.934l-42.119-11.961v59.281h14.732v24.613h-59.973z"
          fill="#2c3e50"
          style={{
            transform: buttonAnimation,
            transformOrigin: "center",
            zIndex: topOfIconzIndex,
          }}
        />
        <animated.g
          transform="translate(3.2542 .678)"
          style={{
            opacity: xCordsChildren.interpolate(xCord => -(xCord / 100) + 1),
            transform: xCordsChildren.interpolate(
              xCord =>
                `scale(${-(xCord / 100) + 1}) translate3d(0,${-(xCord / 100) +
                  1}px,0)`
            ),
            transformOrigin: "center",
          }}
        >
          <circle
            cx="252.75"
            cy="333.1"
            r="176.58"
            fill="#ff5364"
            strokeWidth="2.2226"
          />
          <g
            transform="matrix(1.382 0 0 1.382 -101.07 -130)"
            fill="#fff"
            strokeWidth="1.6082"
          >
            <path d="m256 406.08c-25.362 5e-3 -48.8-13.524-61.483-35.487s-12.684-49.025-3e-3 -70.989c3.9466-6.7321 12.588-9.0174 19.345-5.1142 6.7578 3.9016 9.0994 12.528 5.2428 19.312-10.304 17.901-6.2785 40.616 9.5497 53.885 15.828 13.27 38.897 13.27 54.725 0s19.854-35.984 9.5497-53.885c-3.8566-6.7835-1.515-15.41 5.2428-19.312 6.7578-3.9016 15.399-1.6179 19.345 5.1142 12.684 21.968 12.679 49.037-0.01 71.002-12.691 21.965-36.139 35.489-61.505 35.474z" />
            <path d="m256 320.9c-7.8401 0-14.197-6.3557-14.197-14.197v-28.393c0-7.8401 6.3557-14.197 14.197-14.197s14.197 6.3557 14.197 14.197v28.393c0 7.8401-6.3574 14.197-14.197 14.197z" />
          </g>
        </animated.g>
      </svg>
      {childButtons.map(({ text, request, color }, i) => (
        <ChildIcon
          // style={{
          //   transform: xCordsChildren.interpolate(xCordC => {
          //     return `translate3d(${xCordC}px, ${xCordC}px,0px)`;
          //   }),
          // }}
          key={"ms-icon-child-" + i}
          cords={xCordsChildren}
          className={styles.childIcon}
          containerSize={iconSize.current}
          number={i}
          numberOfChilds={childButtons.length}
          text={text}
          request={request}
          color={color}
          // testOs={triggerRef.current}
        />
      ))}
    </animated.div>
  );
};

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

export default Masterswitch;
