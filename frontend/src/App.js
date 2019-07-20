import React, { useState, useEffect } from "react";
import styles from "./App.module.scss";
// import "./App.scss";
// import cog from "./assets/icons/cog.svg";
import Icon from "./components/Icon/Icon"
import drawing from "./assets/floorplan3d/drawing.svg"

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
        const request = await fetch('http://localhost:3500/devices', {
          method: "POST"
        })
        setData(await request.json())
      } catch (error) {
        setData(error)
      }
    })()
  }, [setData])

  return (
    <div className={styles.mainContainer}>
      <div className={styles.contentArea}>
        <img src={drawing} alt="drawing" style={{display: "block", width:"80%", margin: "5rem auto"}}/>
        <pre>
          {JSON.stringify(data, null, 2)}
          hej med dig!
        </pre>
      </div>
      <nav className={styles.mainNav}>
        <ul className={styles.mainMenu}>
          <li onClick={(e) => console.log('clicked', e.target)}>
            <Icon icon="home"/>
            <span>Home</span> 
          </li>
          <li onClick={(e) => console.log('clicked', e.target)}>
            <Icon icon="floors"/>   
            <span>Rooms</span>  
          </li>
          <li onClick={(e) => console.log('clicked', e.target)}>
            <Icon icon="calendar"/> 
            <span>Date &amp; Time</span>  
          </li>
          <li onClick={(e) => console.log('clicked', e.target)}>
            <Icon icon="stats"/>
            <span>Stats</span>  
          </li>
          <li onClick={(e) => console.log('clicked', e.target)}>
            <Icon icon="cog"/>
            <span>Settings</span>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default App;
