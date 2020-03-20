/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import BookRenderer from './BookRenderer';

const BookUI = ({ source }) => {
  const [offset, setOffset] = useState(0);
  const [containerWidth, setContainerWidth] = useState(null);
  const handleContainerWidthChange = (newWidth) => {
    setContainerWidth(newWidth);
  };
  const [contentWidth, setContentWidth] = useState(null);
  const handleContentWidthChange = (newWidth) => {
    setContentWidth(newWidth);
  };

  const getGapSize = () => 40; // css column-gap property of container
  const prevPage = () => {
    setOffset(offset - (containerWidth + getGapSize()));
  };
  const nextPage = () => {
    setOffset(offset + (containerWidth + getGapSize()));
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
  }, [contentWidth, containerWidth, offset]);

  return (
    <div className="bookUI">
      <div className="leftButton" onClick={prevPage} />
      <BookRenderer
        source={source}
        onContentWidthChange={handleContentWidthChange}
        onContainerWidthChange={handleContainerWidthChange}
        offset={offset}
      />
      <div className="rightButton" onClick={nextPage} />
    </div>
  );
};

BookUI.propTypes = {
  source: PropTypes.string,
};

BookUI.defaultProps = {
  source: '',
};

export default BookUI;
