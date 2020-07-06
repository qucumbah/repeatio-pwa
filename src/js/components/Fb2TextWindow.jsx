import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import Fb2Text from './Fb2Text';

const Fb2TextWindow = (props) => {
  const {
    source,
    onTextWindowSizeChange,
    onBookInfoChange,
    offset,
  } = props;

  const textWindowRef = useRef();
  const textRef = useRef();
  useEffect(() => {
    const callOnTextWindowSizeChange = () => {
      onTextWindowSizeChange(
        textWindowRef.current.clientWidth,
        textWindowRef.current.scrollWidth,
      );
    };
    callOnTextWindowSizeChange();
    window.onresize = callOnTextWindowSizeChange;
    return () => {
      window.onresize = null;
    };
  });

  useEffect(() => {
    textWindowRef.current.scrollLeft = offset;
  }, [offset]);

  return (
    <div
      className="fb2TextWindow"
      ref={textWindowRef}
    >
      <Fb2Text
        source={source}
        onBookInfoChange={onBookInfoChange}
        ref={textRef}
      />
    </div>
  );
};

Fb2TextWindow.propTypes = {
  source: PropTypes.string.isRequired,
  onTextWindowSizeChange: PropTypes.func.isRequired,
  onBookInfoChange: PropTypes.func.isRequired,
  offset: PropTypes.number.isRequired,
};

export default Fb2TextWindow;
