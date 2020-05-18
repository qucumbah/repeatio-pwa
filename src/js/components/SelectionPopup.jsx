import React, {
  useRef,
  useEffect,
  useState,
  useContext,
  useLayoutEffect
} from 'react';
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

  const [shouldSlideDown, setShouldSlideDown] = useState(false);

  const popupRef = useRef();
  const getIsAboveScreen = () => popupRef.current.getBoundingClientRect().y < 0;
  useLayoutEffect(() => setShouldSlideDown(getIsAboveScreen()), [text]);

  console.log(
    popupRef.current ? popupRef.current.getBoundingClientRect().y : null,
    shouldSlideDown
  );

  const getPopupHeight = () => popupRef.current.getBoundingClientRect().height;

  const positionStyle = {
    left: `${position.x}px`,
    top: `${position.y + ((shouldSlideDown) ? getPopupHeight() + 40 : 0)}px`,
  };

  return (
    <div className="selectionPopup" style={positionStyle} ref={popupRef}>
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
