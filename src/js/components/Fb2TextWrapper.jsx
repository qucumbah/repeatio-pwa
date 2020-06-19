import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import Fb2Text from './Fb2Text';

const Fb2TextWrapper = (props) => {
  const {
    source,
    onWrapperSizeChange,
    onBookInfoChange,
    offset,
    onTextSelect,
    onTextUnselect,
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

  const checkSelection = () => {
    const selection = (
      (window.getSelection && window.getSelection())
      || (document.getSelection && document.getSelection())
    );
    if (selection.toString().length === 0) {
      onTextUnselect();
    } else {
      const {
        x,
        y,
        width,
        height
      } = selection.getRangeAt(0).getBoundingClientRect();
      onTextSelect({
        x,
        y,
        width,
        height,
        text: selection.toString(),
      });
    }
  };

  return (
    <div
      className="bookTextWrapper"
      ref={wrapperRef}
      onTouchEnd={checkSelection}
      onMouseUp={() => requestAnimationFrame(checkSelection)}
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
  onTextSelect: PropTypes.func.isRequired,
  onTextUnselect: PropTypes.func.isRequired,
};

export default Fb2TextWrapper;
