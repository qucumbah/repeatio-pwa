import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const NumberInput = ({ label, ariaLabel, onChange, initialValue }) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    onChange(value);
  }, [value, onChange]);

  return (
    <div className="numberInput">
      <label htmlFor="numberInputElement">
        <input
          type="number"
          id="numberInputElement"
          value={value}
          aria-label={ariaLabel}
          onChange={(event) => setValue(event.target.value)}
        />
        <div className="text">{label}</div>
      </label>
    </div>
  );
};

NumberInput.propTypes = {
  label: PropTypes.string.isRequired,
  ariaLabel: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,

  initialValue: PropTypes.number,
};

NumberInput.defaultProps = {
  initialValue: 0,
};

export default NumberInput;
