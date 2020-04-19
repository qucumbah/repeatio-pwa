import React from 'react';
import PropTypes from 'prop-types';

const Overlay = ({ isVisible, content }) => {
  const className = `overlay ${isVisible ? 'visible' : 'invisible'}`;
  return (
    <div className={className}>{content}</div>
  );
};

Overlay.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  content: PropTypes.string.isRequired,
};

export default Overlay;
