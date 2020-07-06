/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';

import Fb2TextWindow from './Fb2TextWindow';
import SelectionPopupArea from './SelectionPopupArea';
import BookMenuWrapper from './BookMenuWrapper';
import PageCounter from './PageCounter';

const Fb2Ui = ({
  source,
  onBookClose,
  onBookInfoChange,
}) => {
  const [curPage, setCurPage] = useState(1);
  const [totalPages, setTotalPages] = useState(-1);
  const [textWindowWidth, setTextWindowWidth] = useState(null);

  useEffect(() => {
    setCurPage(1);
  }, [source]);

  const getGapSize = () => 40; // css column-gap property of textWindow
  const handleTextWindowSizeChange = useCallback((
    newTextWindowWidth,
    newTextWidth,
  ) => {
    const progress = curPage / totalPages;
    setTextWindowWidth(newTextWindowWidth);

    const newTotalPages = Math.ceil(
      newTextWidth / (newTextWindowWidth + getGapSize())
    );
    const newCurPage = Math.round(progress * newTotalPages);
    setCurPage(newCurPage);
    setTotalPages(newTotalPages);
  }, [curPage, totalPages]);

  const goToPrevPage = () => {
    if (curPage - 1 < 1) {
      return;
    }
    setCurPage(curPage - 1);
  };
  const goToNextPage = () => {
    if (curPage + 1 > totalPages) {
      return;
    }
    setCurPage(curPage + 1);
  };

  const bookUIRef = useRef();
  useEffect(() => {
    const keyDownHandler = (event) => {
      if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
        goToNextPage();
      }
      if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
        goToPrevPage();
      }
    };

    bookUIRef.current.focus();
    bookUIRef.current.onkeydown = keyDownHandler;
    return () => {
      bookUIRef.current.onkeydown = null;
    };
  }, [curPage, totalPages]);

  const [prevButtonActive, setPrevButtonActive] = useState(true);
  const [nextButtonActive, setNextButtonActive] = useState(true);
  useEffect(() => {
    setPrevButtonActive(curPage !== 1);
    setNextButtonActive(curPage !== totalPages);
  }, [curPage, totalPages]);

  const prevButtonClassName = (
    `pageButton prevButton ${prevButtonActive ? 'active' : 'inactive'}`
  );
  const nextButtonClassName = (
    `pageButton nextButton ${nextButtonActive ? 'active' : 'inactive'}`
  );

  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
    <div className="fb2Ui" ref={bookUIRef} tabIndex="0">
      <button
        type="button"
        aria-label="previous page"
        className={prevButtonClassName}
        onClick={goToPrevPage}
        onTouchEnd={goToPrevPage}
      />
      <BookMenuWrapper onBookClose={onBookClose} />
      <button
        type="button"
        aria-label="next page"
        className={nextButtonClassName}
        onClick={goToNextPage}
        onTouchEnd={goToNextPage}
      />
      <SelectionPopupArea>
        <Fb2TextWindow
          source={source}
          onTextWindowSizeChange={handleTextWindowSizeChange}
          onBookInfoChange={onBookInfoChange}
          offset={(curPage - 1) * (textWindowWidth + getGapSize())}
        />
      </SelectionPopupArea>
      <div className="pageCounterContainer">
        <PageCounter
          curPage={curPage}
          totalPages={totalPages}
          onCurPageChange={setCurPage}
        />
      </div>
    </div>
  );
};

Fb2Ui.propTypes = {
  source: PropTypes.string,
  onBookClose: PropTypes.func.isRequired,
  onBookInfoChange: PropTypes.func.isRequired,
};

Fb2Ui.defaultProps = {
  source: '',
};

export default Fb2Ui;
