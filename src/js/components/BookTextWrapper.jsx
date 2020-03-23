import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import BookText from './BookText';

const BookTextWrapper = (props) => {
  const {
    source,
    onWrapperSizeChange,
    onBookInfoChange,
    offset,
  } = props;

  const wrapperRef = useRef();
  const textRef = useRef();
  useEffect(() => {
    const callOnWrapperSizeChange = () => {
      onWrapperSizeChange(
        wrapperRef.current.clientWidth,
        wrapperRef.current.clientHieght,
        wrapperRef.current.scrollWidth,
      );
    };
    callOnWrapperSizeChange();
    window.onresize = callOnWrapperSizeChange;
    return () => {
      window.onresize = null;
    };
  }, [source]);

  useEffect(() => {
    wrapperRef.current.scrollLeft = offset;
  }, [offset]);

  return (
    <div className="bookTextWrapper" ref={wrapperRef}>
      <BookText
        source={source}
        onBookInfoChange={onBookInfoChange}
        ref={textRef}
      />
    </div>
  );
};

BookTextWrapper.propTypes = {
  source: PropTypes.string.isRequired,
  onWrapperSizeChange: PropTypes.func.isRequired,
  onBookInfoChange: PropTypes.func.isRequired,
  offset: PropTypes.number.isRequired,
};

export default BookTextWrapper;
