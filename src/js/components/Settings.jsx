import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import { SettingsContext } from './SettingsProvider';

import ListItem from './ListItem';
import ColorChooser from './ColorChooser';
import Switch from './Switch';
import NumberInput from './NumberInput';

const Settings = ({ onClose }) => {
  const {
    darkTheme,
    setDarkTheme,
    fontSize,
    setFontSize,
  } = useContext(SettingsContext);
  return (
    <div className="overlayMenu settings">
      <h2>Settings</h2>
      <ol className="list">
        <ListItem name="Favorite color">
          <ColorChooser />
        </ListItem>
        <ListItem name="Theme">
          <Switch
            labelOn="Dark"
            labelOff="Light"
            ariaLabel="Theme switch"
            initiallyOn={darkTheme}
            onChange={setDarkTheme}
          />
        </ListItem>
        <ListItem name="Font size">
          <NumberInput
            label="px"
            ariaLabel="Font size input"
            initialValue={fontSize}
            onChange={setFontSize}
          />
        </ListItem>
      </ol>
      <button
        className="closeButton"
        type="button"
        aria-label="close"
        onClick={onClose}
      />
    </div>
  );
};

Settings.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default Settings;
