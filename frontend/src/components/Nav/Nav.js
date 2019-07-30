import React, { useRef, useState, useEffect } from "react";
import {
  // useSprings,
  // interpolate
  useSpring,
  animated,
} from "react-spring";
import { useGesture } from "react-use-gesture";
import styles from "./Nav.module.scss";
import Icon from "../Icon/Icon";
import chevronUp from "../../assets/icons/chevron-up.svg";

export default function Nav(props) {
  const lastLocalY = useRef(0);
  const footerRef = useRef(null);
  // const containterHeight = footerRef.current
  //   ? footerRef.current.clientHeight * 2
  //   : 0;
  const [containerHeight, setContainerHeight] = useState(0);
  // console.log("TCL: Nav -> containterHeight", containterHeight);
  const halfContainerHeight = containerHeight / 2;
  const quaterContainerHeight = containerHeight / 4;
  const startingPoint = 0;
  // console.log("TCL: Nav -> footerRef", footerRef)

  useEffect(() => {
    if (footerRef.current) {
      setContainerHeight(footerRef.current.clientHeight * 2);
    }
  }, [footerRef]);

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

      // y = Math.round(y)

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

      // console.log( 'y', y, 'ld', aLd, "diff", diff, "yD", yDelta, "llY", llY, "lllY", lastLocalY.current)

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

  return (
    <footer className={styles.mainFooter}>
      <animated.nav
        className={styles.mainNav}
        {...bind()}
        // onClick={toggle}
        style={{
          opacity: curOpa,
          transform: y.interpolate(y => `translate3d(0,${y}px,0)`),
        }}
      >
        <ul className={styles.mainMenu} ref={footerRef}>
          <li
          // onClick={e => console.log("clicked", e.target)}
          >
            <Icon classes={styles.icon} icon="home" text="home" />
          </li>
          <li
          // onClick={e => console.log("clicked", e.target)}
          >
            <Icon classes={styles.icon} icon="floors" text="Rooms" />
          </li>
          <li
          // onClick={e => console.log("clicked", e.target)}
          >
            <Icon classes={styles.icon} icon="calendar" text="Date & Time" />
          </li>
          <li
          // onClick={e => console.log("clicked", e.target)}
          >
            <Icon classes={styles.icon} icon="stats" text="Stats" />
          </li>
          <li
          // onClick={e => console.log("clicked", e.target)}
          >
            <Icon classes={styles.icon} icon="cog" text="Settings" />
          </li>
        </ul>
        <animated.div
          className={styles.mainNavHandle}
          style={{ transform: rotateChevron }}
          // {...bind()}
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
