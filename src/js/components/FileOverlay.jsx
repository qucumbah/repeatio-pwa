import React from 'react';
import PropTypes from 'prop-types';

const FileOverlay = ({ isVisible, content }) => {
  const className = (
    `overlay fileOverlay ${isVisible ? 'visible' : 'invisible'}`
  );
  return (
    <div className={className}>{content}</div>
  );
};

FileOverlay.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  content: PropTypes.string.isRequired,
};

export default FileOverlay;
