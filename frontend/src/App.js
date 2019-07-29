import React, { useState, useEffect } from "react";
import styles from "./App.module.scss";
import Nav from "./components/Nav/Nav";
import drawing from "./assets/floorplan3d/drawing.svg";
import Home from "./components/Home/Home";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";
// import pic from "./assets/floorplan3d/living-dining-room.png";

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    // fetch('http://localhost:3500/devices', {
    //   method: "POST"
    // }).then(data =>
    //   data.json()
    // ).then(data => {
    //   setData(data)
    // }).catch(err =>
    //   setData(err)
    // )

    (async () => {
      try {
        const request = await fetch("http://localhost:3500/devices", {
          method: "POST",
        });
        setData(await request.json());
      } catch (error) {
        setData(error);
      }
    })();
  }, [setData]);

  return (
    <ErrorBoundary>
      <div className={styles.mainContainer}>
        <div className={styles.contentArea}>
          <div className={styles.contentContainer}>
            {/* <img src={pic} alt="drawing" style={{display: "block", width:"80%", margin: "5rem auto"}}/> */}
            {/* <img src={drawing} alt="drawing" style={{display: "block", width:"80%", margin: "5rem auto"}}/> */}
            <Home />
            <pre>
              {JSON.stringify(data, null, 2)}
              hej med dig!
            </pre>
          </div>
        </div>
        <Nav />
      </div>
    </ErrorBoundary>
  );
}

export default App;
