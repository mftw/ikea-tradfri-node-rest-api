import React, { useState } from "react";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";

import Nav from "./components/Nav/Nav";
import Home from "./components/Home/Home";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";

import styles from "./App.module.scss";
import "./App.scss";
// import pic from "./assets/floorplan3d/living-dining-room.png";

const Settings = props => {
  return (
    <div style={{ width: "90vw", height: "50vh", background: "#333333" }}>
      this is settings
    </div>
  );
};

// const views = [<Home />, <Settings />];
const views = {
  home: <Home key="home" />,
  settings: <Settings key="settings" />,
};

const CurrentView = props => {
  const { view } = props;
  if (view in views) {
    return (
      <ReactCSSTransitionGroup
        transitionName="main-views"
        transitionEnterTimeout={500}
        transitionLeaveTimeout={500}
        // Animate mounting
        transitionAppear={true}
        transitionAppearTimeout={1000}
      >
        {views[view]}
      </ReactCSSTransitionGroup>
    );
  }
  return <div>404</div>;
};

function App() {
  const [view, setView] = useState("home");

  return (
    <ErrorBoundary>
      <div className={styles.mainContainer}>
        <div className={styles.contentArea}>
          <CurrentView view={view} />
        </div>
        <Nav changeView={setView} currentView={view} />
      </div>
    </ErrorBoundary>
  );
}

export default App;
