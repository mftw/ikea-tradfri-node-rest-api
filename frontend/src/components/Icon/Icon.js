import React from 'react';
import icons from './paths';
import PropTypes from 'prop-types';

const Icon = ({icon, alt, classes, noDefault}) => {
  let className = (noDefault ? "" : "icon") + (classes ? " " + classes : "");

  // prevent empty class attribute at render
  className = className === "" ? null : className + "";

  if(!icon) {
    return "Missing icon prop"
  }
  if(!(icon in icons)) {
    return `Icon ${icon} does not exist`
  }
  return(
    // <svg version="1.1" width="20" height="20" viewBox="0 0 20 20">
    // setting height and width of svg to prevent it from collapsing
    <svg width="100%" height="100%" viewBox="0 0 20 20" className={className}>
      {alt ? <title>{alt}</title> : <title>{icon}</title>}
      {icons[icon]}
    </svg>
  )
}

Icon.propTypes = {
  icon: PropTypes.string.isRequired,
  alt: PropTypes.string,
  classes: PropTypes.string
}

export default Icon;