import React, { useState, useEffect, useReducer, useRef } from "react";
import FloorPlan from "./FloorPlan/FloorPlan";
import styles from "./Home.module.scss";
import { requestSender } from "../../lib/js/helpers/network";
import Remote from "../Devices/Remote/Remote";
import EditMenu from "./EditMenu/EditMenu";
import Masterswitch from "../Devices/Masterswitch/Masterswitch";
import db from "../../lib/js/db/db";
// import dummyGroups from "../../lib/js/DummyData/groupData/groupData";
// const dummyGroups = React.lazy(() =>
//   import("../../lib/js/DummyData/groupData/groupData")
// );

const reducer = (state, action) => {
  switch (action) {
    case "increment":
      return state + 1;
    case "decrement":
      return state - 1;
    case "reset":
      return 0;
    default:
      throw new Error("Unexpected action in reducer");
  }
};

export default function Home(props) {
  const [groups, setGroups] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [resetIconState, setResetIconState] = useState(false);
  const [resetIconCount, dispatchIconCount] = useReducer(reducer, 0);
  const containerRef = useRef(null);
  const containerSize = useRef([0, 0]);

  useEffect(() => {
    if (containerRef.current) {
      containerSize.current = [
        containerRef.current.clientWidth,
        containerRef.current.clientHeight,
      ];
    }
  }, [containerRef, containerSize]);
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
        // console.log("TCL: Home -> devices", devices);
        console.log("Fetch from", request.url, "successful");
        setGroups(response);
      } catch (error) {
        console.log("Fetched failed", error);
        // // let test
        console.log("Attempting to use local db");
        const dbGroups = db
          .get("groups")
          .cloneDeep()
          .value();
        if (dbGroups && dbGroups.length > 0) {
          console.log("setting db groups");
          setGroups(dbGroups);
        } else {
          console.log("no db..");
          console.log("attempting dynamic importing");
          (async () => {
            try {
              const dynamicImport = await import(
                "../../lib/js/DummyData/groupData/groupData"
              );
              console.log("TCL: Home -> dynamicImport", dynamicImport.default);
              db.get("groups")
                .assign(dynamicImport.default)
                .write();
              setGroups(dynamicImport.default);
              console.log("Dynamic import success");
            } catch (err) {
              console.log("dynamic import failed", err);
            }
          })();
        }
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
    // window.localStorage.removeItem("tradfri-db");
    setResetIconState(true);
  }
  return (
    <article className={styles.homeContainer}>
      <figure className={styles.floorPlanContainer} ref={containerRef}>
        <FloorPlan editMode={editMode} />
        <div className={styles.iconContainer}>
          <Masterswitch
            key={"masterswitchIcon"}
            movable={editMode}
            remoteId={"masterswitchIcon"}
            name={"Masterswitch"}
            reset={resetIconState}
            resetCallback={resetCallback}
            containerSize={containerSize}
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
                group={group[1]}
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
