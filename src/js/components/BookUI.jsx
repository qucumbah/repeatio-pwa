/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import BookTextWrapper from './BookTextWrapper';

const BookUI = ({ source, onBookInfoChange }) => {
  const [curPage, setCurPage] = useState(0);
  const [totalPages, setTotalPages] = useState(-1);
  const [wrapperWidth, setWrapperWidth] = useState(null);
  const [textWidth, setTextWidth] = useState(null);

  const [prevButtonActive, setPrevButtonActive] = useState(true);
  const [nextButtonActive, setNextButtonActive] = useState(true);
  const updateButtons = () => {
    setPrevButtonActive(curPage !== 0);
    setNextButtonActive(curPage !== totalPages - 1);
  };

  const getGapSize = () => 40; // css column-gap property of wrapper
  const handleWrapperSizeChange = (
    newWrapperWidth,
    newWrapperHeight,
    newTextWidth,
  ) => {
    console.log(newWrapperWidth, newTextWidth);
    const progress = (totalPages === -1) ? 0 : curPage / totalPages;
    setWrapperWidth(newWrapperWidth);
    setTextWidth(newTextWidth);
    const newTotalPages = Math.ceil(
      newTextWidth / (newWrapperWidth + getGapSize())
    );
    setTotalPages(newTotalPages);
    setCurPage(Math.round(progress * newTotalPages));
    updateButtons();
  };

  const prevPage = () => {
    if (curPage - 1 < 0) {
      return;
    }
    setCurPage(curPage - 1);
    updateButtons();
  };
  const nextPage = () => {
    if (curPage + 1 >= totalPages) {
      return;
    }
    setCurPage(curPage + 1);
    updateButtons();
  };

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
  }, [wrapperWidth, curPage]);

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
        offset={curPage * (wrapperWidth + getGapSize())}
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
};

BookUI.defaultProps = {
  source: '',
};

export default BookUI;
