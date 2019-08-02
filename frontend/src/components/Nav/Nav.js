import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  // useSprings,
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

  // useEffect(() => {
  //   // go the fuck up, at mount.
  //   goUp();
  // }, [goUp]);

  const [{ y }, setSpring] = useSpring(() => ({ y: startingPoint }));

  const bind = useGesture(animation => {
    const {
      // eslint-disable-next-line
      delta: [xDelta, yDelta],
      // eslint-disable-next-line
      direction: [xDir, yDir],
      down,
      last,
    } = animation;

    setSpring(() => {
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

  const cbGoUp = useCallback(() => {
    lastLocalY.current = -halfContainerHeight;
    setSpring({ y: -halfContainerHeight });
  }, [setSpring, halfContainerHeight]);

  useEffect(() => {
    // go the fuck up, at mount.
    cbGoUp();
  }, [cbGoUp]);

  function goDown() {
    lastLocalY.current = startingPoint;
    setSpring({ y: startingPoint });
  }
  // goDown();

  function goUp() {
    lastLocalY.current = -halfContainerHeight;
    setSpring({ y: -halfContainerHeight });
  }

  function toggle() {
    if (lastLocalY.current !== startingPoint) {
      goDown();
    } else {
      goUp();
    }
  }
  const navOpacity = y.interpolate({
    map: Math.abs,
    range: [startingPoint, halfContainerHeight],
    output: ["0.3", "1"],
    extrapolate: "clamp",
  });

  const rotateChevron = y.interpolate({
    map: Math.abs,
    range: [-startingPoint, halfContainerHeight],
    output: ["scale(1,1)", "scale(1,-1)"],
    // output: ["rotateX(0deg)", "rotateX(180deg)"],
    extrapolate: "clamp",
  });

  const yTranslate = y.interpolate(y => `translate3d(0,${y}px,0)`);

  const rotateX = y.interpolate({
    map: Math.abs,
    range: [-startingPoint, halfContainerHeight],
    // output: ["scale(1,1)", "scale(1,-1)"],
    output: ["rotateX(-90deg)", "rotateX(0deg)"],
    extrapolate: "clamp",
  });

  function navButtonProps(view) {
    const onClick = () => changeView(view);
    let props = {
      onClick,
    };
    if (currentView === view) {
      props.className = styles.activeNav;
    }
    return props;
  }

  function appearOnMouseOver(autoDisappear = false) {
    let props = {};
    if (autoDisappear) {
      props.onMouseLeave = goDown;
      props.onMouseEnter = goUp;
    }
    return props;
  }

  return (
    <footer className={styles.mainFooter}>
      <animated.nav
        ref={footerRef}
        className={styles.mainNav}
        {...bind()}
        {...appearOnMouseOver()}
        style={{
          opacity: navOpacity,
          transform: yTranslate,
        }}
      >
        <animated.ul className={styles.mainMenu} style={{ transform: rotateX }}>
          <li {...navButtonProps("home")}>
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
          <li {...navButtonProps("settings")}>
            <Icon classes={styles.icon} icon="cog" text="Settings" />
          </li>
        </animated.ul>
        <animated.div
          className={styles.mainNavHandle}
          style={{ transform: rotateChevron }}
          onClick={toggle}
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
