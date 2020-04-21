import React from 'react';
import PropTypes from 'prop-types';

const Settings = ({ onClose }) => {
  // console.log('Settings open');
  return <div className="settings" onClick={onClose}>Settings</div>;
};

Settings.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default Settings;
