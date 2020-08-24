import React, { useContext } from 'react';

import { SettingsContext } from './SettingsProvider';

const ColorChooser = () => {
  const {
    temporaryColorHue,
    setTemporaryColorHue,
    permanentColorHue,
    setPermanentColorHue,
  } = useContext(SettingsContext);

  const getHue = (event) => {
    const elementWidth = event.target.getBoundingClientRect().width;
    const elementOffset = event.target.getBoundingClientRect().left;
    const relativePosition = event.pageX - elementOffset;
    const coefficient = relativePosition / elementWidth;
    return coefficient * 360;
  };

  const handleColorChange = (event) => {
    const coefficient = getHue(event);
    setTemporaryColorHue(coefficient);
    setPermanentColorHue(coefficient);
  };

  const handleColorChangePreview = (event) => {
    const coefficient = getHue(event);
    setTemporaryColorHue(coefficient);
  };

  const resetColorChange = () => {
    setTemporaryColorHue(permanentColorHue);
  };
  const colorPreviewStyle = {
    left: `${(temporaryColorHue / 360) * 100}%`,
  };

  return (
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
  );
};

export default ColorChooser;
