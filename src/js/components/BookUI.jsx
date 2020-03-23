/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import BookTextWrapper from './BookTextWrapper';

const BookUI = ({ source, onBookInfoChange }) => {
  const [curPage, setCurPage] = useState(0);
  const [totalPages, setTotalPages] = useState(-1);
  const [wrapperWidth, setWrapperWidth] = useState(null);
  const [textWidth, setTextWidth] = useState(null);

  const curPageRef = useRef(curPage);
  const totalPagesRef = useRef(totalPages);

  const getGapSize = () => 40; // css column-gap property of wrapper
  const handleWrapperSizeChange = (
    newWrapperWidth,
    newWrapperHeight,
    newTextWidth,
  ) => {
    console.log(curPageRef.current, totalPagesRef.current);
    const progress = curPageRef.current / totalPagesRef.current;
    setWrapperWidth(newWrapperWidth);
    setTextWidth(newTextWidth);

    const newTotalPages = Math.ceil(
      newTextWidth / (newWrapperWidth + getGapSize())
    );
    const newCurPage = Math.round(progress * newTotalPages);
    console.log(progress, newTotalPages, newCurPage);
    setCurPage(newCurPage);
    setTotalPages(newTotalPages);
    curPageRef.current = newCurPage;
    totalPagesRef.current = newTotalPages;
  };

  const prevPage = () => {
    if (curPage - 1 < 0) {
      return;
    }
    setCurPage(curPage - 1);
    curPageRef.current = curPage - 1;
  };
  const nextPage = () => {
    if (curPage + 1 >= totalPages) {
      return;
    }
    setCurPage(curPage + 1);
    curPageRef.current = curPage + 1;
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
