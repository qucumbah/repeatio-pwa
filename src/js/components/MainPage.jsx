import React from 'react';
import PropTypes from 'prop-types';

import MenuLink from './MenuLink';
import ColorChooser from './ColorChooser';

import SettingsIcon from '../../img/settings.svg';
import RepeatListIcon from '../../img/book.svg';
import LoginIcon from '../../img/man.svg';
import SignupIcon from '../../img/laptop.svg';
import FaqIcon from '../../img/info.svg';
import GithubIcon from '../../img/github.svg';

const MainPage = ({
  onFileChange,
  onSettingsMenuOpen,
  onRepeatListOpen,
  onHelpMenuOpen,
  onSignupMenuOpen,
  onLoginMenuOpen,
}) => {
  const handleFileInput = (event) => {
    const inputNode = event.target;
    onFileChange(inputNode.files[0]);
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
          {/* <MenuLink action={onRepeatListOpen} icon={RepeatListIcon}>
            Repeat list
          </MenuLink> */}
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
        <div className="mainPageCenterContent">
          <h1>Welcome to Repeatio!</h1>
          <div className="menu fileMenu">
            <span className="subtitle">Drag and drop your book</span>
            <div className="content">
              <label className="plate" htmlFor="fileChooser">
                Or click here to choose a file
                <input type="file" id="fileChooser" onInput={handleFileInput} />
              </label>
            </div>
          </div>
          <div className="menu">
            <span className="subtitle">Choose your favourite color</span>
            <div className="content">
              <ColorChooser />
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
  onRepeatListOpen: PropTypes.func.isRequired,
  onHelpMenuOpen: PropTypes.func.isRequired,
  onSignupMenuOpen: PropTypes.func.isRequired,
  onLoginMenuOpen: PropTypes.func.isRequired,
};

export default MainPage;
