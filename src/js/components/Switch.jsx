import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const Switch = ({ labelOn, labelOff, ariaLabel, onChange, initiallyOn }) => {
  const [on, setOn] = useState(initiallyOn);

  useEffect(() => {
    onChange(on);
  }, [on, onChange]);

  return (
    <div className="switch">
      <label htmlFor="switchCheckbox">
        <input
          type="checkbox"
          id="switchCheckbox"
          checked={on}
          aria-label={ariaLabel}
          onChange={() => setOn((prevOn) => !prevOn)}
        />
        <div className={`switchGraphic ${on ? 'on' : 'off'}`} />
        <div className="text">{on ? labelOn : labelOff}</div>
      </label>
    </div>
  );
};

Switch.propTypes = {
  labelOn: PropTypes.string.isRequired,
  labelOff: PropTypes.string.isRequired,
  ariaLabel: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,

  initiallyOn: PropTypes.bool,
};

Switch.defaultProps = {
  initiallyOn: false,
};

export default Switch;
