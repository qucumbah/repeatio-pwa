import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

const FileChooserDropzone = ({ onFileDrag, onFileChange }) => {
  useEffect(() => {
    const preventDefault = (event) => {
      event.stopPropagation();
      event.preventDefault();
    };

    window.ondragover = (event) => {
      preventDefault(event);
      if (event.dataTransfer.items[0].kind !== 'file') {
        return;
      }
      onFileDrag(true);
    };
    window.ondragleave = (event) => {
      preventDefault(event);
      onFileDrag(false);
    };
    window.ondrop = (event) => {
      preventDefault(event);
      onFileDrag(false);
      const file = event.dataTransfer.files[0];
      if (file instanceof File) {
        onFileChange(file);
      }
    };

    return () => {
      window.ondragover = null;
      window.ondragleave = null;
      window.ondrop = null;
      onFileDrag(false);
    };
  }, []);

  return <div className="fileChooserDropzone" />;
};

FileChooserDropzone.propTypes = {
  onFileDrag: PropTypes.func.isRequired,
  onFileChange: PropTypes.func.isRequired,
};

export default FileChooserDropzone;
