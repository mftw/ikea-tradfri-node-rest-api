import React from "react";
import icons from "./paths";
import PropTypes from "prop-types";

const Icon = props => {
  const { icon, classes, noDefaultClass, text, styling, onClick } = props;
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
    <div {...props} onClick={onClick} className={className} style={styling}>
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
  text: PropTypes.string,
};

export default Icon;
