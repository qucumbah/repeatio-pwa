import React from 'react';
import PropTypes from 'prop-types';

const Switch = ({ labelOn, labelOff, ariaLabel, value: on, onChange }) => (
  <div className="switch">
    <label htmlFor="switchCheckbox">
      <input
        type="checkbox"
        id="switchCheckbox"
        checked={on}
        aria-label={ariaLabel}
        onChange={() => onChange(!on)}
      />
      <div className={`switchGraphic ${on ? 'on' : 'off'}`} />
      <div className="text">{on ? labelOn : labelOff}</div>
    </label>
  </div>
);

Switch.propTypes = {
  labelOn: PropTypes.string.isRequired,
  labelOff: PropTypes.string.isRequired,
  ariaLabel: PropTypes.string.isRequired,
  value: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default Switch;
