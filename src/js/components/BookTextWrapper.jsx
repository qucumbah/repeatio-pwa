import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import BookText from './BookText';

const BookTextWrapper = (props) => {
  const {
    source,
    onWrapperWidthChange,
    onBookInfoChange,
    offset,
  } = props;

  const wrapperRef = useRef();
  useEffect(() => {
    onWrapperWidthChange(wrapperRef.current.clientWidth);
  }, [wrapperRef.current ? wrapperRef.current.clientWidth : null]);

  useEffect(() => {
    wrapperRef.current.scrollLeft = offset;
  }, [offset]);

  return (
    <div className="bookTextWrapper" ref={wrapperRef}>
      <BookText source={source} onBookInfoChange={onBookInfoChange} />
    </div>
  );
};

BookTextWrapper.propTypes = {
  source: PropTypes.string.isRequired,
  onWrapperWidthChange: PropTypes.func.isRequired,
  onBookInfoChange: PropTypes.func.isRequired,
  offset: PropTypes.number.isRequired,
};

export default BookTextWrapper;
