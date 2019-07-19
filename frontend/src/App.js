import React, { useState, useEffect } from "react";
import "./App.scss";

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
    <div className="main-container">
      {JSON.stringify(data)}
    </div>
  );
}

export default App;
