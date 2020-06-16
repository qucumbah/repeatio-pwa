import React, { useState } from 'react';
import PropTypes from 'prop-types';

const PageCounter = ({ curPage, totalPages, onCurPageChange }) => {
  const [pageInputActive, setPageInputActive] = useState(false);
  const pageCounter = (
    <span
      className="pageCounter"
      aria-label="Go to page"
      onClick={() => setPageInputActive(true)}
    >
      {`${curPage + 1} / ${totalPages}`}
    </span>
  );

  const changePage = (inputValue) => {
    setPageInputActive(false);

    if (Number.isNaN(Number(inputValue))) {
      return;
    }

    console.log(totalPages);

    const clamp = (value, min, max) => Math.max(min, Math.min(value, max));
    const clampedNewValue = clamp(inputValue - 1, 0, totalPages - 1);

    onCurPageChange(clampedNewValue);
  };
  const pageInput = (
    <>
      <input
        className="pageInput"
        type="text"
        defaultValue={curPage + 1}
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus
        onBlur={(event) => changePage(event.target.value)}
        onKeyPress={(event) => {
          if (event.key === 'Enter') {
            changePage(event.target.value);
          }
        }}
      />
      <span>{`/ ${totalPages}`}</span>
    </>
  );

  return pageInputActive ? pageInput : pageCounter;
};

PageCounter.propTypes = {
  curPage: PropTypes.number,
  totalPages: PropTypes.number,
  onCurPageChange: PropTypes.func,
};

export default PageCounter;
