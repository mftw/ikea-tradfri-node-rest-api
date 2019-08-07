import React from "react";
import {
  // useSprings,
  interpolate,
  // useSpring,
  animated,
  // config,
} from "react-spring";
// import styles from "./Masterswitch.module.scss";
import styles from "./ChildIcon.module.scss";
import { calcDir } from "../common/helpers";

function calcDirOld(itemNumber, y) {
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

// function calcDir(currentItem, circleSize, itemCount) {
//   const angle = 360 / itemCount;
//   const rotation = angle * currentItem - 90;
//   return `rotate(${rotation}deg) translate(${circleSize}px) rotate(${-rotation}deg)`;
// }

const ChildIcon = props => {
  const {
    cords,
    className,
    containerSize,
    number,
    text,
    request,
    numberOfChilds,
    color,
  } = props;

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
    // y => calcDir(number, y)
    y => calcDir(number, y, numberOfChilds)
  );

  function handleClick(e) {
    e.stopPropagation();
    request();
  }

  return (
    <animated.figure
      // ref={divRef}
      className={className}
      // style={{
      //   transform: props.cords,
      // }}
      style={{
        transform: translateInter,
        opacity: cords.interpolate(c => c / 100),
      }}
      // ref={ref}
      onClick={handleClick}
      onMouseDown={e => e.stopPropagation()}
      onTouchStart={e => e.stopPropagation()}
      // className={styles.chilIcon}
    >
      <svg
        enableBackground="new 0 0 512 512"
        version="1.1"
        viewBox="0 0 512 512"
        xmlns="http://www.w3.org/2000/svg"
        // style={styles.childIconSvg}
      >
        {/* <circle cx="256" cy="256" r="225" fill="#ff5364" strokeWidth="2.832" /> */}
        <circle cx="256" cy="256" r="225" fill={color} strokeWidth="2.832" />
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
    </animated.figure>
  );
};

export default ChildIcon;
