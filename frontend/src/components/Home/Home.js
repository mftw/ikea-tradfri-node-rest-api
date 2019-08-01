import React, { useState, useEffect, useRef, useReducer } from "react";
import FloorPlan from "./FloorPlan/FloorPlan";
import styles from "./Home.module.scss";
import { requestSender } from "../../lib/js/helpers/network";
import LightBulb from "../Devices/LightBulb/LightBulb";

const reducer = (state, action) => {
  switch (action) {
    case "increment":
      return state + 1;
    case "decrement":
      return state - 1;
    case "reset":
      return 0;
    default:
      throw new Error("Unexpected action");
  }
};

export default function Home(props) {
  const [groups, setGroups] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [resetIconState, setResetIconState] = useState(false);
  const [resetIconCount, dispatchIconCount] = useReducer(reducer, 0);
  useEffect(() => {
    (async () => {
      try {
        const request = await requestSender("rooms", { test: "test" });
        const response = await request.json();
        // console.log("TCL: FloorPlan -> response", response);
        window.localStorage.setItem("groups", JSON.stringify(response));
        setGroups(response);
      } catch (error) {
        console.log("TCL: FloorPlan -> error", error);
      }
    })();
  }, [setGroups]);

  useEffect(() => {
    if (resetIconCount >= groups.length) {
      dispatchIconCount("reset");
      setResetIconState(false);
    }
    const localStorageGroups = window.localStorage.getItem("groups");
    if (localStorageGroups) {
      setGroups(JSON.parse(localStorageGroups));
    }
  }, [groups.length, resetIconCount]);

  function resetCallback() {
    dispatchIconCount("increment");
  }
  return (
    <div className={styles.homeContainer}>
      <div className={styles.floorPlanContainer}>
        <FloorPlan editMode={editMode} />
        <div className={styles.iconContainer}>
          {groups.map((group, i) => {
            return (
              <LightBulb
                key={"light" + i}
                movable={editMode}
                bulbId={group[0]}
                name={group[1].group.name}
                reset={resetIconState}
                resetCallback={resetCallback}
              />
            );
          })}
        </div>
      </div>
      <button onClick={() => setEditMode(!editMode)}>
        turn editmode {editMode ? "off" : "on"}
      </button>
      <button onClick={() => setResetIconState(true)}>reset</button>
    </div>
  );
}
