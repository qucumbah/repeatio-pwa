import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

export const SettingsContext = React.createContext();

export const SettingsProvider = ({ children }) => {
  const [temporaryColorHue, setTemporaryColorHue] = useState(180);
  const [permanentColorHue, setPermanentColorHue] = useState(180);

  const [darkTheme, setDarkTheme] = useState(false);
  const [fontSize, setFontSize] = useState(16);

  useEffect(() => {
    const rootStyle = document.querySelector(':root').style;
    rootStyle.setProperty(
      '--theme-primary',
      `hsl(${temporaryColorHue}, 100%, 50%)`,
    );
    rootStyle.setProperty(
      '--theme-secondary',
      `hsl(${temporaryColorHue}, 100%, 30%)`,
    );
    rootStyle.setProperty(
      '--theme-darker',
      `hsl(${temporaryColorHue}, 100%, 10%)`,
    );

    const needContrastText = (
      (temporaryColorHue > 0.1) && (temporaryColorHue < 0.2)
    );
    rootStyle.setProperty(
      '--theme-text',
      needContrastText ? 'var(--theme-darker)' : 'white',
    );
  }, [temporaryColorHue]);

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
