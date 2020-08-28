import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';

import SelectionPopup from './SelectionPopup';

const SelectionPopupArea = ({ children }) => {
  const [selectionPopupState, setSelectionPopupState] = useState({
    visible: false,
    position: { x: 0, y: 0 },
    text: '',
  });

  const handleSelectionPopupOpen = ({ x, y, width, text }) => {
    setSelectionPopupState({
      visible: true,
      position: { x: x + width / 2, y },
      text,
    });
  };
  const handleSelectionPopupClose = useCallback(() => {
    setSelectionPopupState((prevState) => ({
      visible: false,
      position: prevState.position,
      text: prevState.text,
    }));
  }, []);

  const checkSelection = () => {
    const selection = (
      (window.getSelection && window.getSelection())
      || (document.getSelection && document.getSelection())
    );

    if (selection.toString().length === 0) {
      return;
    }

    const {
      x,
      y,
      width,
      height
    } = selection.getRangeAt(0).getBoundingClientRect();
    handleSelectionPopupOpen({
      x,
      y,
      width,
      height,
      text: selection.toString(),
    });
  };

  return (
    <div
      className="selectionPopupArea"
      onMouseUp={checkSelection}
    >
      {children}
      <SelectionPopup
        visible={selectionPopupState.visible}
        position={selectionPopupState.position}
        text={selectionPopupState.text}
        onClose={handleSelectionPopupClose}
      />
    </div>
  );
};

SelectionPopupArea.propTypes = {
  children: PropTypes.node.isRequired,
};

export default SelectionPopupArea;
