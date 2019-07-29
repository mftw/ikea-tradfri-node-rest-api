import React, { useRef } from 'react'
import { 
  // useSprings, 
  // interpolate 
  useSpring, 
  animated, 
} from 'react-spring'
import { useGesture } from 'react-use-gesture'
import styles from "./Nav.module.scss"
import Icon from "../Icon/Icon"

export default function Nav(props) {
  const lastLocalY = useRef(0)
  const footerRef = useRef(null);
  const containterHeight = footerRef.current ? footerRef.current.clientHeight * 2 : 0;
  const halfContainerHeight = containterHeight / 2;
  const quaterContainerHeight = containterHeight / 4;
  const startingPoint = -20;
  console.log("TCL: Nav -> footerRef", footerRef)

  const [{ y }, set] = useSpring(() => ({ y: startingPoint }));
  const bind = useGesture(stuff => {
    const {
      // eslint-disable-next-line
      delta: [xDelta, yDelta],
      // eslint-disable-next-line
      direction: [xDir, yDir],
      down,
      last,
      // lastLocal: [llX, llY]
      // distance,
      // cancel,
      // currentTarget,
      // event,
      // moving,
      // lastLocal: [llX, llY]
    } = stuff
    // console.log(stuff)
    set(() => {
      const generelDir = {
        up: yDir < 0,
        down: yDir > 0,
        // any: !!moving
      }
      const curLastLocalY = lastLocalY.current
      let y = yDelta + curLastLocalY
      // let y = yDelta + llY;

      // Making it "snap" to the top and bottom.
      if (!down) {
        if (generelDir.up) {
          y = -halfContainerHeight
        }
        if (generelDir.down) {
          y = startingPoint
        }
        if (last) {
          if (y > -quaterContainerHeight) {
            y = startingPoint
          } else {
            y = -halfContainerHeight
          }
        }
      }

      // y = Math.round(y)

      // Setting upper limit
      if (y < -halfContainerHeight) {
        y = -halfContainerHeight
      }

      // Setting lower limit
      if (y > startingPoint) {
        y = startingPoint
      }

      if (last) {
        lastLocalY.current = y
      }

      // console.log( 'y', y, 'ld', aLd, "diff", diff, "yD", yDelta, "llY", llY, "lllY", lastLocalY.current)

      return {
        y,
        // config: {
        //   tension: 200,
        //   friction: 100,
        //   // precision: 0.01,
        // }
      }
    })
  })

  // const transform = y.interpolate({
  //   map: Math.abs,
  //   range: [0, halfContainerHeight],
  //   output: ['scale(0.5) translate3d(0,0px,0)', `scale(1) translate3d(0,${-halfContainerHeight}px,0`],
  //   extrapolate: 'clamp'
  // })

  function goDown() {
    lastLocalY.current = startingPoint
    set({y: startingPoint})
  }
  // goDown();

  function goUp() {
    lastLocalY.current = -halfContainerHeight;
    set({y: -halfContainerHeight})
  }

  function toggle() {
    if(lastLocalY.current !== startingPoint) {
      goDown()
    } else {
      goUp()
    }
  }
  const curOpa = y.interpolate({
    map: Math.abs,
    range: [0, halfContainerHeight],
    output: ['0.3', '1'],
    extrapolate: 'clamp'
  })

  return (
    <footer className={styles.mainFooter} ref={footerRef}>
      <animated.nav 
        className={styles.mainNav} 
        {...bind()} 
        onClick={toggle}
        style={{
          // transform,
          // display,
          opacity: curOpa,
          transform: y.interpolate(y => `translate3d(0,${y}px,0)`),
        }}>
        <ul className={styles.mainMenu}>
          <li onClick={(e) => console.log('clicked', e.target)}>
            <Icon classes={styles.icon} icon="home" text="home" />
          </li>
          <li onClick={(e) => console.log('clicked', e.target)}>
            <Icon classes={styles.icon} icon="floors" text="Rooms" />   
          </li>
          <li onClick={(e) => console.log('clicked', e.target)}>
            <Icon classes={styles.icon} icon="calendar" text="Date & Time" /> 
          </li>
          <li onClick={(e) => console.log('clicked', e.target)}>
            <Icon classes={styles.icon} icon="stats" text="Stats" />
          </li>
          <li onClick={(e) => console.log('clicked', e.target)}>
            <Icon classes={styles.icon} icon="cog" text="Settings" />
          </li>
        </ul>
      </animated.nav>
    </footer>
  )
}