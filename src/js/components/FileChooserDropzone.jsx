import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const FileChooserDropzone = ({ onFileChange }) => {
  const [isVisible, setIsVisible] = useState(false);
  const className = (
    `fileChooserDropzone ${isVisible ? 'visible' : 'invisible'}`
  );

  useEffect(() => {
    const preventDefault = (event) => {
      event.stopPropagation();
      event.preventDefault();
    };

    window.ondragover = (event) => {
      preventDefault(event);
      setIsVisible(true);
    };
    window.ondragleave = (event) => {
      preventDefault(event);
      setIsVisible(false);
    };
    window.ondrop = (event) => {
      preventDefault(event);
      setIsVisible(false);
      const file = event.dataTransfer.files[0];
      onFileChange(file);
    };

    return () => {
      window.ondragover = null;
      window.ondragleave = null;
      window.ondrop = null;
      setIsVisible(false);
    };
  }, []);

  return <div className={className}>Drop FB2 Here</div>;
};

FileChooserDropzone.propTypes = {
  onFileChange: PropTypes.func.isRequired,
};

export default FileChooserDropzone;
