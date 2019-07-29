import React from "react";
import icons from "./paths";
import PropTypes from "prop-types";

const Icon = ({
  icon,
  alt,
  classes,
  noDefaultClass,
  text,
  styling,
  onClick,
}) => {
  let className =
    (noDefaultClass ? "" : "icon") + (classes ? " " + classes : "");

  // prevent empty class attribute at render
  className = className === "" ? null : className;

  if (!icon) {
    return "Missing icon prop";
  }
  if (!(icon in icons)) {
    return `Icon ${icon} does not exist`;
  }
  return (
    <div onClick={onClick} className={className} style={styling}>
      {icons[icon]}
      {!!text && <span>{text}</span>}
    </div>
  );
};

Icon.propTypes = {
  icon: PropTypes.string.isRequired,
  alt: PropTypes.string,
  classes: PropTypes.string,
  styling: PropTypes.object,
};

export default Icon;
