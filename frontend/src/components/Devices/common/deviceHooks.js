import { useEffect, useState, useRef } from "react";
import { useGesture } from "react-use-gesture";
import {
  // useSprings,
  // interpolate,
  // useSpring,
  // animated,
  config as reactSpringConfig,
} from "react-spring";

// effect to reset the holdtrigger
export function useResetHoldTrigger(
  isComponentClicked,
  triggerRef,
  setTransformChildSpring
) {
  useEffect(() => {
    if (!isComponentClicked && triggerRef.current === true) {
      triggerRef.current = false;
      setTransformChildSpring(() => ({
        // transform: "translate3d(0,0,0)",
        xCordsChildren: 0,
        yCordsChildren: 0,
        zIndex: 250,
        // from: { transform: "translate3d(120%,120%,0)", },
      }));
    }
  }, [isComponentClicked, triggerRef, setTransformChildSpring]);
}

// effect to reset the remotes positon
export function useResetPos(
  reset,
  setMoveSpring,
  remoteId,
  resetCallback,
  holdTimer,
  resetHoldTimer,
  lastLocalXY,
  config
) {
  useEffect(() => {
    if (reset) {
      setMoveSpring(() => ({
        x: 0,
        y: 0,
        config: config || reactSpringConfig.stiff,
      }));
      lastLocalXY.current = [0, 0];
      window.localStorage.removeItem("" + remoteId);
      resetCallback();
    }

    return () => resetHoldTimer();
  }, [
    reset,
    setMoveSpring,
    remoteId,
    resetCallback,
    holdTimer,
    resetHoldTimer,
    lastLocalXY,
    config,
  ]);
}

// effect to get container dimensions
export function useGetContainerSize(containerRef) {
  const ref = useRef(null);
  // const [containerSize, setContainerSize] = useState([0, 0]);
  const containerSize = useRef([0, 0]);
  useEffect(() => {
    if (containerRef.current) {
      // setContainerSize([
      //   containerRef.current.clientWidth,
      //   containerRef.current.clientHeight,
      // ]);
      containerSize.current = [
        containerRef.current.clientWidth,
        containerRef.current.clientHeight,
      ];
    } else if (ref.current) {
      // setContainerSize([ref.current.clientWidth, ref.current.clientHeight]);
      containerSize.current = [
        ref.current.clientWidth,
        ref.current.clientHeight,
      ];
    }
  }, [ref, containerSize, containerRef]);

  return [containerSize, ref];
}

// effect to look for coordinates in localstorage
export function useGetLocalStorageCoordinates(
  remoteId,
  lastLocalXY,
  setMoveSpring
  // config
) {
  useEffect(() => {
    const localStorageXYJSON = window.localStorage.getItem("" + remoteId);
    // const localStorageXY = db
    //   .get("devices")
    //   .find(device => "" + remoteId in device)
    //   .value().cords;

    if (localStorageXYJSON) {
      const localStorageXY = JSON.parse(localStorageXYJSON);
      lastLocalXY.current = localStorageXY;
      setMoveSpring(() => ({
        x: localStorageXY[0],
        y: localStorageXY[1],
        // Using duration cancels all physics cus ain't nobody got time for that, at mount
        // disable to get nice animation of bulbs floating into position
        // config: config || { duration: 1 },
        config: { duration: 1 },
      }));
    }
  }, [remoteId, setMoveSpring, lastLocalXY]);
}

// effect to check if click events is outside element
export function useOutsideAlerter(initialIsVisible) {
  const [isComponentClicked, setIsComponentVisible] = useState(
    initialIsVisible
  );
  const componentRef = useRef(null);

  const handleClickOutside = event => {
    // event.preventDefault();
    // event.stopPropagation();
    if (componentRef.current && !componentRef.current.contains(event.target)) {
      setIsComponentVisible(false);
    } else if (
      componentRef.current &&
      componentRef.current.contains(event.target)
    ) {
      setIsComponentVisible(true);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside, true);
    document.addEventListener("touchstart", handleClickOutside, true);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside, true);
      document.removeEventListener("touchstart", handleClickOutside, true);
    };
  });

  return { componentRef, isComponentClicked, setIsComponentVisible };
}

export function useDraggable(
  setMoveSpring,
  touchStart,
  handleTriggerToggle,
  resetHoldTimer,
  holdTimer,
  skipNextClickEvent,
  holdTime,
  movable,
  handleTriggerOff,
  lastLocalXY,
  remoteId,
  setLocalStorageXY,
  config
) {
  const bind = useGesture(animation => {
    const {
      delta: [xDelta, yDelta],
      // eslint-disable-next-line
      // direction: [xDir, yDir],
      moving,
      down,
      last,
      cancel,
    } = animation;

    setMoveSpring(() => {
      if (down && !moving && xDelta === 0 && yDelta === 0) {
        if (!touchStart.current) {
          holdTimer.current = setTimeout(() => {
            handleTriggerToggle();
            skipNextClickEvent.current = true;
          }, holdTime);
        }
        touchStart.current = true;
      }
      if (down && xDelta !== 0 && yDelta !== 0) {
        resetHoldTimer();
        handleTriggerOff();
      }
      if (!movable) {
        cancel();
      } else {
        const [lastLocalX, lastLocalY] = lastLocalXY.current;
        let x = xDelta + lastLocalX;
        let y = yDelta + lastLocalY;

        if (last) {
          void setLocalStorageXY([x, y], remoteId);
          lastLocalXY.current = [x, y];
        }

        return {
          x,
          y,
          config: config || reactSpringConfig.stiff,
        };
      }
    });
  });

  return bind;
}
