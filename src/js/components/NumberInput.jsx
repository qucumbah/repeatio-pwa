import React from 'react';
import PropTypes from 'prop-types';

const NumberInput = ({ label, ariaLabel, value, onChange }) => (
  <div className="numberInput">
    <label htmlFor="numberInputElement">
      <input
        type="number"
        id="numberInputElement"
        value={value}
        aria-label={ariaLabel}
        onChange={(event) => onChange(parseInt(event.target.value, 10))}
      />
      <div className="text">{label}</div>
      <button
        className="plus"
        type="button"
        aria-label="increase value"
        onClick={() => onChange(value + 1)}
      />
      <button
        className="minus"
        type="button"
        aria-label="decrease value"
        onClick={() => onChange(value - 1)}
      />
    </label>
  </div>
);

NumberInput.propTypes = {
  label: PropTypes.string.isRequired,
  ariaLabel: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default NumberInput;
