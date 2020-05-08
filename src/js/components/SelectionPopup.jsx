import React, { useRef, useEffect, useState, useContext } from 'react';
import PropTypes from 'prop-types';

import { RepeatListContext } from './RepeatListProvider';

import Translation from './Translation';

const SelectionPopup = ({
  position,
  text: inputText,
  onClose,
}) => {
  useEffect(() => {
    const handleWindowKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleWindowKeyDown);
    return () => window.removeEventListener('keydown', handleWindowKeyDown);
  });

  const [text, setText] = useState(inputText);

  const { onWordAdd } = useContext(RepeatListContext);
  const inputRef = useRef();
  const handleWordAdd = () => {
    const wordText = inputRef.current.value;
    onWordAdd(wordText);
    onClose();
  };

  const positionStyle = {
    left: `${position.x}px`,
    top: `${position.y}px`,
  };
  return (
    <div className="selectionPopup" style={positionStyle}>
      <div className="word">
        <input
          type="text"
          value={text}
          onChange={(event) => setText(event.target.value)}
          ref={inputRef}
        />
      </div>
      <Translation text={text} />
      <div className="buttons">
        <div className="button okButton" onClick={handleWordAdd}>Add</div>
        <div className="button cancelButton" onClick={onClose}>Cancel</div>
      </div>
    </div>
  );
};

SelectionPopup.propTypes = {
  text: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  position: PropTypes.exact({
    x: PropTypes.number,
    y: PropTypes.number,
  }).isRequired,
};

export default SelectionPopup;
