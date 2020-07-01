import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import Fb2Text from './Fb2Text';

const Fb2TextWrapper = (props) => {
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
        wrapperRef.current.scrollWidth,
      );
    };
    callOnWrapperSizeChange();
    window.onresize = callOnWrapperSizeChange;
    return () => {
      window.onresize = null;
    };
  });

  useEffect(() => {
    wrapperRef.current.scrollLeft = offset;
  }, [offset]);

  return (
    <div
      className="fb2TextWrapper"
      ref={wrapperRef}
    >
      <Fb2Text
        source={source}
        onBookInfoChange={onBookInfoChange}
        ref={textRef}
      />
    </div>
  );
};

Fb2TextWrapper.propTypes = {
  source: PropTypes.string.isRequired,
  onWrapperSizeChange: PropTypes.func.isRequired,
  onBookInfoChange: PropTypes.func.isRequired,
  offset: PropTypes.number.isRequired,
};

export default Fb2TextWrapper;
