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

function calcDir(itemNumber, y) {
  // y => `translate3d(${-y}px,${-y}px,0)`;
  switch (itemNumber) {
    case 0: {
      return `translate3d(0px,${-y}px,0)`;
    }
    case 1: {
      return `translate3d(${y}px,0px,0)`;
    }
    case 2: {
      return `translate3d(0px,${y}px,0)`;
    }
    case 3: {
      return `translate3d(${-y}px,0px,0)`;
    }
    default: {
      return `translate3d(${-y}px,${y}px,0)`;
    }
  }
}

const ChildIcon = props => {
  const { cords, className, containerSize, number, text, request } = props;

  // const divRef = useRef(null);

  // useEffect(() => {
  //   if (divRef.current) {
  //     divSize.current = [
  //       divRef.current.clientWidth,
  //       divRef.current.clientHeight,
  //     ];
  //   }
  // }, [divRef]);

  const translateInter = interpolate(
    [
      cords.interpolate({
        map: Math.abs,
        range: [0, 100],
        // output: ["scale(1,1)", "scale(1,-1)"],
        // output: [0, divSize.current[0]],
        output: [0, containerSize[0]],
        extrapolate: "clamp",
      }),
    ],
    y => calcDir(number, y)
  );

  function handleClick(e) {
    e.stopPropagation();
    request();
  }

  return (
    <animated.div
      // ref={divRef}
      className={className}
      onMouseDown={e => e.stopPropagation()}
      onTouchStart={e => e.stopPropagation()}
      onClick={handleClick}
      // style={{
      //   transform: props.cords,
      // }}
      style={{
        transform: translateInter,
      }}
      // ref={ref}
      // className={styles.chilIcon}
    >
      <svg
        enableBackground="new 0 0 512 512"
        version="1.1"
        viewBox="0 0 512 512"
        xmlns="http://www.w3.org/2000/svg"
        // style={styles.childIconSvg}
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
      <span className={styles.iconText}>{text || "Icon"}</span>
    </animated.div>
  );
};

const childButtons = [
  {
    text: "Sluk alt",
    request: async () => requestSender("masterswitch", { confirmation: true }),
  },
  {
    text: "Tænd alt",
    request: async () =>
      requestSender("masterswitch/all-on", { confirmation: true }),
  },
  {
    text: "Sa Force",
    request: async () =>
      requestSender("masterswitch", { confirmation: true, force: true }),
  },
  {
    text: "Ta Force",
    request: async () =>
      requestSender("masterswitch/all-on", { confirmation: true, force: true }),
  },
];

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
    document.addEventListener("touchstart", handleClickOutside, true);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside, true);
      document.removeEventListener("touchstart", handleClickOutside, true);
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
  const text = name ? name : remoteId;

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

  const holdTime = 500;

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
  const { ref: containerRef, isComponentClicked } = useOutsideAlerter(true);

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
  }));

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
        zIndex: 250,
        // from: { transform: "translate3d(120%,120%,0)", },
      }));
    }
  }, [isComponentClicked, triggerRef, setTransformChildSpring]);

  const containerSize = useRef([0, 0]);
  useEffect(() => {
    if (containerRef.current) {
      containerSize.current = [
        containerRef.current.clientWidth,
        containerRef.current.clientHeight,
      ];
    }
  }, [containerRef]);

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

  function handlePointerLeave() {
    touchStart.current = false;
    resetHoldTimer();
  }

  const scaleBtnInter = xCordsChildren.interpolate({
    map: Math.abs,
    range: [0, 100],
    output: ["scale(1)", "scale(1.5)"],
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

  return (
    <animated.div
      {...bind()}
      onClick={handleOnClick}
      className={styles.remote}
      style={{
        transform: xyTranslate,
      }}
      onMouseUp={handlePointerLeave}
      onTouchEnd={handlePointerLeave}
      ref={containerRef}
    >
      <svg
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
            // style={{ transform: scaleInter, transformOrigin: "center" }}
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
      {childButtons.map(({ text, request }, i) => (
        <ChildIcon
          // style={{
          //   transform: xCordsChildren.interpolate(xCordC => {
          //     return `translate3d(${xCordC}px, ${xCordC}px,0px)`;
          //   }),
          // }}
          key={"ms-icon-child-" + i}
          cords={xCordsChildren}
          className={styles.childIcon}
          containerSize={containerSize.current}
          number={i}
          text={text}
          request={request}
          // testOs={triggerRef.current}
        />
      ))}
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
