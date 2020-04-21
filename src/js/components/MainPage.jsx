import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import MenuLink from './MenuLink';

import SettingsIcon from '../../img/settings.svg';
import LoginIcon from '../../img/man.svg';
import SignupIcon from '../../img/laptop.svg';
import FaqIcon from '../../img/info.svg';
import GithubIcon from '../../img/github.svg';

const MainPage = ({
  onFileChange,
  onSettingsMenuOpen,
  onHelpMenuOpen,
  onSignupMenuOpen,
  onLoginMenuOpen,
}) => {
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
    return coefficient;
  };

  const handleColorChange = (event) => {
    const coefficient = getCoefficient(event);
    setTemporaryColorCoefficient(coefficient);
    setPermanentColorCoefficient(coefficient);
  };

  const handleColorChangePreview = (event) => {
    const coefficient = getCoefficient(event);
    setTemporaryColorCoefficient(coefficient);
  };

  const resetColorChange = () => {
    setTemporaryColorCoefficient(permanentColorCoefficient);
  };
  const colorPreviewStyle = {
    left: `${temporaryColorCoefficient * 100}%`,
  };

  const openGithubLink = (
    () => window.open('https://github.com/qucumbah/repeatio-pwa', '_blank')
  );

  return (
    <div className="mainPage">
      <div className="links">
        <div className="topLeft">
          <MenuLink action={onSettingsMenuOpen} icon={SettingsIcon}>
            Settings
          </MenuLink>
        </div>
        <div className="topRight">
          <MenuLink action={onSignupMenuOpen} icon={SignupIcon}>
            Signup
          </MenuLink>
          <MenuLink action={onLoginMenuOpen} icon={LoginIcon}>Login</MenuLink>
        </div>
        <div className="bottomLeft">
          <MenuLink action={onHelpMenuOpen} icon={FaqIcon}>Help</MenuLink>
        </div>
        <div className="bottomRight">
          <MenuLink action={openGithubLink} icon={GithubIcon}>Github</MenuLink>
        </div>
      </div>
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
  onSettingsMenuOpen: PropTypes.func.isRequired,
  onHelpMenuOpen: PropTypes.func.isRequired,
  onSignupMenuOpen: PropTypes.func.isRequired,
  onLoginMenuOpen: PropTypes.func.isRequired,
};

export default MainPage;
