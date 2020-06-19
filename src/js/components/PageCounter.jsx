import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

const PageCounter = ({ curPage, totalPages, onCurPageChange }) => {
  const [pageInputActive, setPageInputActive] = useState(false);
  const pageCounter = (
    <span
      className="pageCounter"
      aria-label="Go to page"
      onClick={() => setPageInputActive(true)}
    >
      {`${curPage} / ${totalPages}`}
    </span>
  );

  const changePage = (inputValue) => {
    setPageInputActive(false);

    if (Number.isNaN(Number(inputValue))) {
      return;
    }

    const clamp = (value, min, max) => Math.max(min, Math.min(value, max));
    const clampedNewValue = clamp(inputValue, 1, totalPages);

    onCurPageChange(clampedNewValue);
  };

  const pageInputRef = useRef();
  const pageInput = (
    <>
      <input
        className="pageInput"
        type="text"
        defaultValue={curPage}
        onBlur={(event) => changePage(event.target.value)}
        onKeyPress={(event) => {
          if (event.key === 'Enter') {
            changePage(event.target.value);
          }
        }}
        ref={pageInputRef}
      />
      <span>{`/ ${totalPages}`}</span>
    </>
  );

  useEffect(() => {
    console.log(pageInputActive, pageInputRef);
    if (pageInputActive) {
      pageInputRef.current.select();
    }
  }, [pageInputActive]);

  return pageInputActive ? pageInput : pageCounter;
};

PageCounter.propTypes = {
  curPage: PropTypes.number,
  totalPages: PropTypes.number,
  onCurPageChange: PropTypes.func,
};

export default PageCounter;
