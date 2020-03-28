/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

import BookTextWrapper from './BookTextWrapper';
import SelectionPopup from './SelectionPopup';

const BookUI = ({ source, onBookInfoChange, onWordAdd }) => {
  const [curPage, setCurPage] = useState(0);
  const [totalPages, setTotalPages] = useState(-1);
  const [wrapperWidth, setWrapperWidth] = useState(null);

  useEffect(() => {
    setCurPage(0);
  }, [source]);

  const getGapSize = () => 40; // css column-gap property of wrapper
  const handleWrapperSizeChange = useCallback((
    newWrapperWidth,
    newWrapperHeight,
    newTextWidth,
  ) => {
    const progress = curPage / totalPages;
    setWrapperWidth(newWrapperWidth);

    const newTotalPages = Math.ceil(
      newTextWidth / (newWrapperWidth + getGapSize())
    );
    const newCurPage = Math.round(progress * newTotalPages);
    setCurPage(newCurPage);
    setTotalPages(newTotalPages);
  }, [curPage, totalPages]);

  const prevPage = () => {
    if (curPage - 1 < 0) {
      return;
    }
    setCurPage(curPage - 1);
  };
  const nextPage = () => {
    if (curPage + 1 >= totalPages) {
      return;
    }
    setCurPage(curPage + 1);
  };

  const [prevButtonActive, setPrevButtonActive] = useState(true);
  const [nextButtonActive, setNextButtonActive] = useState(true);
  useEffect(() => {
    setPrevButtonActive(curPage !== 0);
    setNextButtonActive(curPage !== totalPages - 1);
  }, [curPage, totalPages]);

  useEffect(() => {
    const keyDownHandler = (event) => {
      if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
        nextPage();
      }
      if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
        prevPage();
      }
    };

    window.onkeydown = keyDownHandler;
    return () => { window.onkeydown = null; };
  }, [curPage, totalPages]);

  const [selectionPopupVisible, setSelectionPopupVisible] = useState(false);
  const [selectionPopupPosition, setSelectionPopupPosition] = useState();
  const [selectionPopupText, setSelectionPopupText] = useState('');

  const handleTextSelect = ({ x, y, width, text }) => {
    setSelectionPopupVisible(true);
    setSelectionPopupPosition({ x: x + width / 2, y });
    setSelectionPopupText(text);
  };
  const handleSelectionPopupClose = () => {
    setSelectionPopupVisible(false);
  };

  const prevButtonClassName = (
    `pageButton prevButton ${prevButtonActive ? 'active' : 'inactive'}`
  );
  const nextButtonClassName = (
    `pageButton nextButton ${nextButtonActive ? 'active' : 'inactive'}`
  );
  return (
    <div className="bookUI">
      <BookTextWrapper
        source={source}
        onWrapperSizeChange={handleWrapperSizeChange}
        onBookInfoChange={onBookInfoChange}
        onTextSelect={handleTextSelect}
        onTextUnselect={handleSelectionPopupClose}
        offset={curPage * (wrapperWidth + getGapSize())}
      />
      <SelectionPopup
        visible={selectionPopupVisible}
        position={selectionPopupPosition}
        text={selectionPopupText}
        onClose={handleSelectionPopupClose}
        onWordAdd={onWordAdd}
      />
      <div className={prevButtonClassName} onClick={prevPage} />
      <div className={nextButtonClassName} onClick={nextPage} />
      <div className="pageCounter">
        {`${curPage + 1} / ${totalPages}`}
      </div>
    </div>
  );
};

BookUI.propTypes = {
  source: PropTypes.string,
  onBookInfoChange: PropTypes.func.isRequired,
  onWordAdd: PropTypes.func.isRequired,
};

BookUI.defaultProps = {
  source: '',
};

export default BookUI;
