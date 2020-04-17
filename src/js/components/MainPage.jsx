import React from 'react';
import PropTypes from 'prop-types';

const MainPage = ({ onFileChange, showBookUi, isLoading }) => {
  const handleFileInput = (event) => {
    const inputNode = event.target;
    onFileChange(inputNode.files[0]);
  };

  const showBookUiClass = showBookUi ? 'invisible' : '';
  const isLoadingClass = isLoading ? 'isLoading' : '';
  const className = `mainPage ${showBookUiClass} ${isLoadingClass}`;

  return (
    <div className={className}>
      <div className="foreground">
        <h1>Welcome to Repeatio!</h1>
        <div className="menus">
          <div className="menu fileMenu">
            <span className="subtitle">Drag and drop your book</span>
            <label className="plate" htmlFor="fileChooser">
              Or click here to choose a file
              <input type="file" id="fileChooser" onInput={handleFileInput} />
            </label>
          </div>
          <div className="menu colorCircle">
            <span className="subtitle">Choose your favourite color</span>
            <div className="plate colorChooser">Fill</div>
          </div>
        </div>
      </div>
    </div>
  );
};

MainPage.propTypes = {
  onFileChange: PropTypes.func.isRequired,
  showBookUi: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

export default MainPage;
