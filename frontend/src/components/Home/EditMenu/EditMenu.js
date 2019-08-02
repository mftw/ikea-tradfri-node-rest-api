import React, { useEffect } from "react";
import {
  // useSprings,
  useSpring,
  animated,
  interpolate,
} from "react-spring";
import styles from "./EditMenu.module.scss";

/**
 * TODO: make nicer styling and change colors
 *
 */

export default function EditMenu(props) {
  const { editMode, setEditMode, doReset } = props;

  const [{ x }, setSpring] = useSpring(() => ({ x: -101 }));

  useEffect(() => {
    if (editMode) {
      setSpring(() => ({ x: 0 }));
    } else {
      setSpring(() => ({ x: -101 }));
    }
  }, [editMode, setSpring]);

  return (
    <ul className={styles.editMenu}>
      <li onClick={setEditMode}>
        <LockIcon editMode={editMode} />
      </li>
      <animated.li
        onClick={doReset}
        style={{ transform: x.interpolate(x => `translate3d(${x}%,0,0)`) }}
      >
        <DeleteIcon />
      </animated.li>
    </ul>
  );
}

function LockIcon(props) {
  const { editMode } = props;

  const [{ y }, setSpring] = useSpring(() => ({ y: 0 }));

  useEffect(() => {
    if (editMode) {
      setSpring(() => ({ y: 8 }));
    } else {
      setSpring(() => ({ y: 0 }));
    }
  }, [editMode, setSpring]);
  // const rotateX = y.interpolate({
  //   map: Math.abs,
  //   range: [-startingPoint, halfContainerHeight],
  //   // output: ["scale(1,1)", "scale(1,-1)"],
  //   output: ["rotateX(-90deg)", "rotateX(0deg)"],
  //   extrapolate: "clamp",
  // });

  const lockTopTranslate = interpolate(
    [
      y.interpolate(y => y),
      y.interpolate({
        map: Math.abs,
        range: [0, 8],
        // output: ["scale(1,1)", "scale(1,-1)"],
        output: [0, -180],
        extrapolate: "clamp",
      }),
    ],
    (y1, y2) => `translate3d(0,${-y1}%,0) rotateY(${y2}deg)`
  );

  return (
    <div className={styles.editIcon}>
      {/* <svg
        enableBackground="new 0 0 511.219 511.219"
        version="1.1"
        viewBox="0 0 312.41 511.22"
        xmlns="http://www.w3.org/2000/svg"
        // className={styles.editIcon}
      >
        <animated.path
          d="m43.393 224.84c-4.793 0-8.678-3.885-8.678-8.678v-94.677c0-67.097 54.394-121.49 121.49-121.49s121.49 54.394 121.49 121.49v94.677c0 4.793-3.885 8.678-8.678 8.678s-8.678-3.885-8.678-8.678v-94.677c0-57.512-46.623-104.14-104.14-104.14s-104.14 46.623-104.14 104.14v94.677c0 4.792-3.885 8.677-8.678 8.677z"
          fill="#9bc8c2"
          style={{
            transform: z.interpolate(z => `rotateZ(${z}deg)`),
          }}
        />
        <path
          d="m17.353 216.16h277.7c9.585 0 17.356 7.771 17.356 17.356v127.57c0 82.914-67.215 150.13-150.13 150.13h-12.149c-82.914 0-150.13-67.215-150.13-150.13v-127.57c0-9.585 7.771-17.356 17.356-17.356z"
          fill="#f0c419"
        />
        <g transform="translate(-99.407 -.005)" fill="#e57e25">
          <path d="m316.36 346.34h-121.49c-4.793 0-8.678-3.885-8.678-8.678s3.885-8.678 8.678-8.678h121.49c4.793 0 8.678 3.885 8.678 8.678-1e-3 4.792-3.886 8.678-8.679 8.678z" />
          <path d="m316.36 398.4h-121.49c-4.793 0-8.678-3.885-8.678-8.678s3.885-8.678 8.678-8.678h121.49c4.793 0 8.678 3.885 8.678 8.678-1e-3 4.793-3.886 8.678-8.679 8.678z" />
        </g>
      </svg> */}
      <svg
        // width="20"
        // height="20"
        version="1.1"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <animated.path
          d="m12.899 8.6119h-7.1747c-0.62458 0-1.1328 0.50827-1.1328 1.1328v6.0419c0 0.62458 0.50827 1.1328 1.1328 1.1328h7.5523c0.62458 0 1.1328-0.50827 1.1328-1.1328v-6.0419c0-0.62458-0.50827-1.1328-1.1328-1.1328zm-7.1747 0.75523h7.5523c0.20844 0 0.37762 0.16917 0.37762 0.37762v6.0419c0 0.20844-0.16917 0.37762-0.37762 0.37762h-7.5523c-0.20844 0-0.37762-0.16917-0.37762-0.37762v-6.0419c0-0.20844 0.16917-0.37762 0.37762-0.37762z"
          strokeWidth=".75523"
          style={{
            transform: y.interpolate(y => `translate3d(0,${y}%,0)`),
          }}
        />
        <animated.path
          d="m9.5 4.0805c-1.8737 0-3.3985 1.5248-3.3985 3.3985v6.8655h0.75523v-6.8655c0-1.4576 1.1857-2.6433 2.6433-2.6433 1.4576 0 2.6433 1.1857 2.6433 2.6433v1.1328h0.75523v-1.1328c0-1.8737-1.5248-3.3985-3.3985-3.3985z"
          strokeWidth=".75523"
          style={{
            // transform: y.interpolate(y => `translate3d(0,${-y}%,0)`),
            transform: lockTopTranslate,
          }}
        />
      </svg>
    </div>
  );
}

function DeleteIcon(props) {
  return (
    <div className={styles.deleteIcon}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 48 48"
        // className={styles.deleteIcon}
      >
        <path d="M12 38c0 2.2 1.8 4 4 4h16c2.2 0 4-1.8 4-4V14H12v24zm4.93-14.24l2.83-2.83L24 25.17l4.24-4.24 2.83 2.83L26.83 28l4.24 4.24-2.83 2.83L24 30.83l-4.24 4.24-2.83-2.83L21.17 28l-4.24-4.24zM31 8l-2-2H19l-2 2h-7v4h28V8z" />
      </svg>
      <span>Delete</span>
    </div>
  );
}
