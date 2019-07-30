import React, { useState, useEffect } from "react";
import styles from "./App.module.scss";
import Nav from "./components/Nav/Nav";
import Home from "./components/Home/Home";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";
// import pic from "./assets/floorplan3d/living-dining-room.png";

const Settings = props => {
  return <div>this is settings</div>;
};

// const views = [<Home />, <Settings />];
const views = {
  home: <Home />,
  settings: <Settings />,
};

const CurrentView = props => {
  const { view } = props;
  // const Showview = views[view];
  // return <Showview {...props} />;
  if (view in views) {
    return views[view];
  }
  return null;
};

function App() {
  const [view, setView] = useState("home");

  return (
    <ErrorBoundary>
      <div className={styles.mainContainer}>
        <div className={styles.contentArea}>
          <div className={styles.contentContainer}>
            <CurrentView view={view} />
          </div>
        </div>
        <Nav changeView={setView} />
      </div>
    </ErrorBoundary>
  );
}

export default App;
