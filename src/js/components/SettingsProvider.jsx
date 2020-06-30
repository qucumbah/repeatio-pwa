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

    if (settings === null) {
      return;
    }

    setTemporaryColorHue(settings?.permanentColorHue ?? temporaryColorHue);
    setPermanentColorHue(settings?.permanentColorHue ?? permanentColorHue);
    setDarkTheme(settings?.darkTheme ?? darkTheme);
    setFontSize(settings?.fontSize ?? fontSize);
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
    const textOverBackgroundColor = 'black';

    return {
      primaryColor,
      secondaryColor,
      contrastColor,
      backgroundColor,
      overlayBackgroundColor,
      bookBackgroundColor,
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
    const textOverBackgroundColor = '#aaa';

    return {
      primaryColor,
      secondaryColor,
      contrastColor,
      backgroundColor,
      overlayBackgroundColor,
      bookBackgroundColor,
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
      textOverBackgroundColor,
    } = (darkTheme) ? getDarkThemeColors() : getLightThemeColors();

    const hslToRgb = (H, S, L) => {
      const C = (1 - Math.abs(2 * L - 1)) * S;
      const X = C * (1 - Math.abs(((H / 60) % 2) - 1));
      const getRgb = () => {
        if (H < 60) {
          return [C, X, 0];
        }
        if (H < 120) {
          return [X, C, 0];
        }
        if (H < 180) {
          return [0, C, X];
        }
        if (H < 240) {
          return [0, X, C];
        }
        if (H < 300) {
          return [X, 0, C];
        }

        return [C, 0, X];
      };

      const m = L - C / 2;
      return getRgb().map((colorValue) => 255 * (colorValue + m));
    };

    const needsBlackText = (hue) => {
      const [red, green, blue] = hslToRgb(hue, 1, 0.5);
      const brightness = (red * 299 + green * 587 + blue * 114) / 255000;

      return brightness >= 0.5;
    };

    const textOverPrimaryColor = (
      needsBlackText(temporaryColorHue) ? 'black' : 'white'
    );

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
