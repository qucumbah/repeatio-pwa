import React, { useState } from 'react';
import PropTypes from 'prop-types';

// Not sure if I need this yet
const DesktopBookMenu = React.forwardRef((props, ref) => {
  const {
    onPin,
    onSettingsOpen,
    onRepeatListOpen,
  } = props;

  return <></>;
});

DesktopBookMenu.propTypes = {
  onPin: PropTypes.func.isRequired,
  onSettingsOpen: PropTypes.func.isRequired,
  onRepeatListOpen: PropTypes.func.isRequired,
};

export default DesktopBookMenu;
