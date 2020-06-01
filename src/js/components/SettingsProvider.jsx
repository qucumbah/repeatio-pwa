import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

export const SettingsContext = React.createContext();

export const SettingsProvider = ({ children }) => {
  const [temporaryColorHue, setTemporaryColorHue] = useState(180);
  const [permanentColorHue, setPermanentColorHue] = useState(180);

  const [darkTheme, setDarkTheme] = useState(false);
  const [fontSize, setFontSize] = useState(20);

  useEffect(() => {
    const loadSettings = () => JSON.parse(localStorage.getItem('settings'));
    const settings = loadSettings();

    if (settings !== null) {
      setTemporaryColorHue(settings.permanentColorHue);
      setPermanentColorHue(settings.permanentColorHue);
      setDarkTheme(settings.darkTheme);
      setFontSize(settings.fontSize);
    }
  }, []);

  useEffect(() => {
    const saveSettings = () => {
      localStorage.setItem('settings', JSON.stringify({
        permanentColorHue,
        darkTheme,
        fontSize,
      }));
    };
    window.onbeforeunload = saveSettings;
  });

  const getLightThemeColors = () => {
    const primaryColor = `hsl(${temporaryColorHue}, 100%, 50%)`;
    const secondaryColor = `hsl(${temporaryColorHue}, 100%, 30%)`;
    const contrastColor = `hsl(${temporaryColorHue}, 100%, 10%)`;
    const backgroundColor = 'white';
    const overlayBackgroundColor = primaryColor;
    const bookBackgroundColor = backgroundColor;
    const needContrastText = (
      (temporaryColorHue > 0.1) && (temporaryColorHue < 0.2)
    );
    const textOverPrimaryColor = needContrastText ? contrastColor : 'white';
    const textOverBackgroundColor = 'black';

    return {
      primaryColor,
      secondaryColor,
      contrastColor,
      backgroundColor,
      overlayBackgroundColor,
      bookBackgroundColor,
      textOverPrimaryColor,
      textOverBackgroundColor,
    };
  };
  const getDarkThemeColors = () => {
    const primaryColor = `hsl(${temporaryColorHue}, 100%, 50%)`;
    const secondaryColor = `hsl(${temporaryColorHue}, 100%, 30%)`;
    const contrastColor = `hsl(${temporaryColorHue}, 100%, 10%)`;
    const backgroundColor = '#333';
    const overlayBackgroundColor = secondaryColor;
    const bookBackgroundColor = '#222';
    const needContrastText = (
      (temporaryColorHue > 0.1) && (temporaryColorHue < 0.2)
    );
    const textOverPrimaryColor = needContrastText ? contrastColor : 'white';
    const textOverBackgroundColor = '#aaa';

    return {
      primaryColor,
      secondaryColor,
      contrastColor,
      backgroundColor,
      overlayBackgroundColor,
      bookBackgroundColor,
      textOverPrimaryColor,
      textOverBackgroundColor,
    };
  };

  useEffect(() => {
    const {
      primaryColor,
      secondaryColor,
      contrastColor,
      backgroundColor,
      overlayBackgroundColor,
      bookBackgroundColor,
      textOverPrimaryColor,
      textOverBackgroundColor,
    } = (darkTheme) ? getDarkThemeColors() : getLightThemeColors();

    const rootStyle = document.querySelector(':root').style;
    rootStyle.setProperty('--primary', primaryColor);
    rootStyle.setProperty('--secondary', secondaryColor);
    rootStyle.setProperty('--contrast', contrastColor);
    rootStyle.setProperty('--background', backgroundColor);
    rootStyle.setProperty('--overlay-background', overlayBackgroundColor);
    rootStyle.setProperty('--book-background', bookBackgroundColor);
    rootStyle.setProperty('--text-over-primary', textOverPrimaryColor);
    rootStyle.setProperty('--text-over-background', textOverBackgroundColor);

    rootStyle.setProperty('font-size', `${fontSize}px`);
  }, [temporaryColorHue, permanentColorHue, darkTheme, fontSize]);

  const settings = {
    temporaryColorHue,
    setTemporaryColorHue,
    permanentColorHue,
    setPermanentColorHue,
    darkTheme,
    setDarkTheme,
    fontSize,
    setFontSize,
  };

  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  );
};

SettingsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
