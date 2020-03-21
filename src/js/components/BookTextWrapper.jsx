import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import BookText from './BookText';

const BookTextWrapper = (props) => {
  const {
    source,
    onTextWidthChange,
    onWrapperWidthChange,
    offset,
  } = props;

  const wrapperRef = useRef();
  useEffect(() => {
    onWrapperWidthChange(wrapperRef.current.clientWidth);
  }, [wrapperRef.current ? wrapperRef.current.clientWidth : null]);

  const textRef = useRef();
  useEffect(() => {
    onTextWidthChange(textRef.current.clientWidth);
  }, [textRef.current ? textRef.current.clientWidth : null]);

  useEffect(() => {
    wrapperRef.current.scrollLeft = offset;
  }, [offset]);

  return (
    <div className="bookTextWrapper" ref={wrapperRef}>
      <BookText
        source={source}
        onTextWidthChange={onTextWidthChange}
        ref={textRef}
      />
    </div>
  );
};

BookTextWrapper.propTypes = {
  source: PropTypes.string.isRequired,
  onTextWidthChange: PropTypes.func.isRequired,
  onWrapperWidthChange: PropTypes.func.isRequired,
  offset: PropTypes.number.isRequired,
};

export default BookTextWrapper;
