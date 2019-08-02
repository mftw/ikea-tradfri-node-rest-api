import React, { useState, useEffect, useReducer } from "react";
import FloorPlan from "./FloorPlan/FloorPlan";
import styles from "./Home.module.scss";
import { requestSender } from "../../lib/js/helpers/network";
import Remote from "../Devices/Remote/Remote";
import EditMenu from "./EditMenu/EditMenu";
import Masterswitch from "../Devices/Masterswitch/Masterswitch";
import db from "../../lib/js/db/db";

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
        // const data = Object.entries(response);
        // console.log("TCL: FloorPlan -> response", response);
        // window.localStorage.setItem("groups", JSON.stringify(response));
        // db.set("groups", response).write();
        const groups = db
          .get("groups")
          .assign(response)
          .write();
        const devices = groups.map(group => ({ [group[0]]: group[1] }));
        db.get("devices")
          .assign(devices)
          // .map((device, i) =>  )
          .write();
        console.log("TCL: Home -> devices", devices);
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
    // const localStorageGroups = window.localStorage.getItem("groups");
    const localStorageGroups = db
      .get("groups")
      .cloneDeep()
      .value();
    if (localStorageGroups) {
      // setGroups(JSON.parse(localStorageGroups));
      setGroups(localStorageGroups);
    }
  }, [groups.length, resetIconCount]);

  function resetCallback() {
    dispatchIconCount("increment");
  }

  function toggleEditMode() {
    setEditMode(!editMode);
  }

  function handleResetIconState() {
    setResetIconState(true);
  }
  return (
    <article className={styles.homeContainer}>
      <figure className={styles.floorPlanContainer}>
        <FloorPlan editMode={editMode} />
        <div className={styles.iconContainer}>
          <Masterswitch
            key={"masterswitchIcon"}
            movable={editMode}
            remoteId={"masterswitchIcon"}
            name={"Masterswitch"}
            reset={resetIconState}
            resetCallback={resetCallback}
          />
          {groups.map((group, i) => {
            return (
              // <LightBulb
              <Remote
                key={"light" + i}
                movable={editMode}
                remoteId={group[0]}
                name={group[1].group.name}
                reset={resetIconState}
                resetCallback={resetCallback}
              />
            );
          })}
        </div>
      </figure>
      <section>
        <EditMenu
          editMode={editMode}
          setEditMode={toggleEditMode}
          doReset={handleResetIconState}
        />
      </section>
    </article>
  );
}
