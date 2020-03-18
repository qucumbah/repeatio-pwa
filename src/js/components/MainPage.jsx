import React, {useCallback} from 'react';
import PropTypes from 'prop-types';

const MainPage = ({ onFileChange }) => {
  const handleFileInput = (event) => {
    const inputNode = event.target;
    onFileChange(inputNode.files[0]);
  };

  return (
    <div className="mainPage">
      This is the main page
      <br />
      Drag and drop your book
      <br />
      <label htmlFor="fileChooser">
        Or choose a file from here
        <input type="file" id="fileChooser" onInput={handleFileInput} />
      </label>
    </div>
  );
};

MainPage.propTypes = {
  onFileChange: PropTypes.func.isRequired,
};

export default MainPage;
