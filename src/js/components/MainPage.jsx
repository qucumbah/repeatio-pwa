import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const MainPage = ({ onFileChange, showBookUi, isLoading }) => {
  const handleFileInput = (event) => {
    const inputNode = event.target;
    onFileChange(inputNode.files[0]);
  };

  const [
    permanentColorCoefficient,
    setPermanentColorCoefficient
  ] = useState(0.5);
  const [
    temporaryColorCoefficient,
    setTemporaryColorCoefficient
  ] = useState(0.5);

  useEffect(() => {
    const rootStyle = document.querySelector(':root').style;
    rootStyle.setProperty(
      '--theme-primary',
      `hsl(${temporaryColorCoefficient * 360}, 100%, 50%)`,
    );
    rootStyle.setProperty(
      '--theme-secondary',
      `hsl(${temporaryColorCoefficient * 360}, 100%, 30%)`,
    );
    rootStyle.setProperty(
      '--theme-darker',
      `hsl(${temporaryColorCoefficient * 360}, 100%, 10%)`,
    );

    console.log(temporaryColorCoefficient);
    const needContrastText = (
      (temporaryColorCoefficient > 0.1) && (temporaryColorCoefficient < 0.2)
    );
    rootStyle.setProperty(
      '--theme-text',
      needContrastText ? 'var(--theme-darker)' : 'white',
    );
  }, [temporaryColorCoefficient]);

  const getCoefficient = (event) => {
    const elementWidth = event.target.getBoundingClientRect().width;
    const elementOffset = event.target.getBoundingClientRect().left;
    const relativePosition = event.pageX - elementOffset;
    const coefficient = relativePosition / elementWidth;
    // console.log(event);
    // console.log(elementWidth, elementOffset, event.pageX);
    return coefficient;
  };

  const handleColorChange = (event) => {
    const coefficient = getCoefficient(event);
    setTemporaryColorCoefficient(coefficient);
    setPermanentColorCoefficient(coefficient);
    console.log(coefficient);
  };

  const handleColorChangePreview = (event) => {
    const coefficient = getCoefficient(event);
    setTemporaryColorCoefficient(coefficient);
  };

  const resetColorChange = () => {
    setTemporaryColorCoefficient(permanentColorCoefficient);
  };

  const showBookUiClass = showBookUi ? 'invisible' : '';
  const isLoadingClass = isLoading ? 'isLoading' : '';
  const className = `mainPage ${showBookUiClass} ${isLoadingClass}`;

  const colorPreviewStyle = {
    left: `${temporaryColorCoefficient * 100}%`,
  };

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
            <div
              className="plate colorChooser"
              onClick={handleColorChange}
              onMouseMove={handleColorChangePreview}
              onMouseOut={resetColorChange}
              onBlur={resetColorChange}
            >
              <div className="colorPreview" style={colorPreviewStyle} />
              Fill
            </div>
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