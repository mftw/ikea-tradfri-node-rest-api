import React, { useRef, useState, useEffect } from "react";
import {
  // useSprings,
  interpolate,
  useSpring,
  animated,
} from "react-spring";
import { useGesture } from "react-use-gesture";
import styles from "./Nav.module.scss";
import Icon from "../Icon/Icon";

export default function Nav(props) {
  const lastLocalY = useRef(0);
  const footerRef = useRef(null);
  const [containerHeight, setContainerHeight] = useState(0);
  const halfContainerHeight = containerHeight / 2;
  const quaterContainerHeight = containerHeight / 4;
  const startingPoint = 0;
  const { changeView, currentView } = props;

  useEffect(() => {
    if (footerRef.current) {
      setContainerHeight(footerRef.current.clientHeight * 2);
    }
  }, [footerRef]);

  useEffect(() => {
    // go the fuck up, at mount.
    goUp();
  }, [goUp]);

  const [{ y }, set] = useSpring(() => ({ y: startingPoint }));

  const bind = useGesture(animation => {
    const {
      // eslint-disable-next-line
      delta: [xDelta, yDelta],
      // eslint-disable-next-line
      direction: [xDir, yDir],
      down,
      last,
    } = animation;

    set(() => {
      // console.log(containterHeight);
      const generelDir = {
        up: yDir < 0,
        down: yDir > 0,
        // any: !!moving
      };
      const curLastLocalY = lastLocalY.current;
      let y = yDelta + curLastLocalY;
      // let y = yDelta + llY;

      // Making it "snap" to the top and bottom.
      if (!down) {
        if (generelDir.up) {
          y = -halfContainerHeight;
        }
        if (generelDir.down) {
          y = startingPoint;
        }
        if (last) {
          if (y > -quaterContainerHeight) {
            y = startingPoint;
          } else {
            y = -halfContainerHeight;
          }
        }
      }

      // Setting upper limit
      if (y < -halfContainerHeight) {
        y = -halfContainerHeight;
      }

      // Setting lower limit
      if (y > startingPoint) {
        y = startingPoint;
      }

      if (last) {
        lastLocalY.current = y;
      }

      return {
        y,
        // config: {
        //   tension: 200,
        //   friction: 100,
        //   // precision: 0.01,
        // }
      };
    });
  });

  // const transform = y.interpolate({
  //   map: Math.abs,
  //   range: [0, halfContainerHeight],
  //   output: ['scale(0.5) translate3d(0,0px,0)', `scale(1) translate3d(0,${-halfContainerHeight}px,0`],
  //   extrapolate: 'clamp'
  // })

  function goDown() {
    lastLocalY.current = startingPoint;
    set({ y: startingPoint });
  }
  // goDown();

  function goUp() {
    lastLocalY.current = -halfContainerHeight;
    set({ y: -halfContainerHeight });
  }

  function toggle() {
    if (lastLocalY.current !== startingPoint) {
      goDown();
    } else {
      goUp();
    }
  }
  const curOpa = y.interpolate({
    map: Math.abs,
    range: [startingPoint, halfContainerHeight],
    output: ["0.3", "1"],
    extrapolate: "clamp",
  });

  const rotateChevron = y.interpolate({
    map: Math.abs,
    range: [-startingPoint, halfContainerHeight],
    // output: ["scale(1,1)", "scale(1,-1)"],
    output: ["rotateX(0deg)", "rotateX(180deg)"],
    extrapolate: "clamp",
  });

  const yTranslate = y.interpolate(y => `translate3d(0,${y}px,0)`);

  const rotateX = y.interpolate({
    map: Math.abs,
    range: [-startingPoint, halfContainerHeight],
    // output: ["scale(1,1)", "scale(1,-1)"],
    output: ["rotateX(-20deg)", "rotateX(0deg)"],
    extrapolate: "clamp",
  });

  function getProps(view) {
    const onClick = () => changeView(view);
    const isActive = currentView === view;
    if (isActive) {
      return {
        onClick,
        className: styles.activeNav,
      };
    } else {
      return {
        onClick,
      };
    }
  }

  return (
    <footer className={styles.mainFooter}>
      <animated.nav
        ref={footerRef}
        className={styles.mainNav}
        {...bind()}
        // onMouseMove={goUp}
        // onMouseLeave={goDown}
        // onClick={toggle}
        style={{
          opacity: curOpa,
          // transform: y.interpolate(y => `translate3d(0,${y}px,0)`),
          transform: yTranslate,
          // transform: interpolate(
          //   [yTranslate, rotateX],
          //   (trans, rotateX) => `${trans} ${rotateX}`
          // ),
        }}
      >
        <ul className={styles.mainMenu}>
          {/* <li onClick={() => changeView("home")}> */}
          <li {...getProps("home")}>
            <Icon classes={styles.icon} icon="home" text="home" />
          </li>
          <li onClick={() => changeView("sfljkdljkdfs")}>
            <Icon classes={styles.icon} icon="floors" text="Rooms" />
          </li>
          <li>
            <Icon classes={styles.icon} icon="calendar" text="Date & Time" />
          </li>
          <li>
            <Icon classes={styles.icon} icon="stats" text="Stats" />
          </li>
          {/* <li onClick={() => changeView("settings")}> */}
          <li {...getProps("settings")}>
            <Icon classes={styles.icon} icon="cog" text="Settings" />
          </li>
        </ul>
        <animated.div
          className={styles.mainNavHandle}
          style={{ transform: rotateChevron }}
          onClick={toggle}
          // onClick={(() => {
          //   // this is an ugly hack to open the navigation bar at mount using an IIFE
          //   toggle();
          //   return toggle;
          // })()}
        >
          <svg version="1.1" width="100%" height="100%" viewBox="0 0 20 20">
            <path
              fill="#000000"
              d="M0 15c0 0.128 0.049 0.256 0.146 0.354 0.195 0.195 0.512 0.195 0.707 0l8.646-8.646 8.646 8.646c0.195 0.195 0.512 0.195 0.707 0s0.195-0.512 0-0.707l-9-9c-0.195-0.195-0.512-0.195-0.707 0l-9 9c-0.098 0.098-0.146 0.226-0.146 0.354z"
            />
          </svg>
        </animated.div>
      </animated.nav>
    </footer>
  );
}
