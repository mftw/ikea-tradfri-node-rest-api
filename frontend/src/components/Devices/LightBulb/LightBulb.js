import React from "react";
import PropTypes from "prop-types";
import Icon from "../../Icon/Icon";
import styles from "./LightBulb.module.scss";

const LightBulb = props => {
  const styling = {
    top: props.topPlacement,
    left: props.leftPlacement,
  };
  return (
    <Icon
      onClick={props.clicked}
      icon="lightBulb"
      classes={styles.lightBulb}
      styling={styling}
    />
  );
};

export default LightBulb;

LightBulb.propTypes = {
  topPlacement: PropTypes.string.isRequired,
  leftPlacement: PropTypes.string.isRequired,
};
