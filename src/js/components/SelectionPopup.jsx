import React, { useRef } from 'react';
import PropTypes from 'prop-types';

const SelectionPopup = ({
  visible,
  position,
  text,
  onClose,
  onWordAdd,
}) => {
  if (!visible) {
    return null;
  }

  const inputRef = useRef();
  const handleWordAdd = () => {
    const wordText = inputRef.current.value;
    onWordAdd(wordText);
  };

  const positionStyle = {
    left: `${position.x}px`,
    top: `${position.y}px`,
  };
  return (
    <div className="selectionPopup" style={positionStyle}>
      <input type="text" defaultValue={text} ref={inputRef} />
      <div className="buttons">
        <div className="button okButton" onClick={handleWordAdd}>Ok</div>
        <div className="button cancelButton" onClick={onClose}>Cancel</div>
      </div>
    </div>
  );
};

SelectionPopup.propTypes = {
  visible: PropTypes.bool.isRequired,
  text: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onWordAdd: PropTypes.func.isRequired,

  position: PropTypes.exact({
    x: PropTypes.number,
    y: PropTypes.number,
  }),
};

SelectionPopup.defaultProps = {
  position: {
    x: 0,
    y: 0,
  },
};

export default SelectionPopup;
