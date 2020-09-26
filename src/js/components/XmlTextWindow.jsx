import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import XmlText from './XmlText';

const XmlTextWindow = ({
  book,
  onTextWindowSizeChange,
  onBookInfoChange,
  offset,
}) => {
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
      className="xmlTextWindow"
      ref={textWindowRef}
    >
      <XmlText
        book={book}
        onBookInfoChange={onBookInfoChange}
        textRef={textRef}
      />
    </div>
  );
};

XmlTextWindow.propTypes = {
  book: PropTypes.shape({
    format: PropTypes.string,
    source: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(Map)
    ]),
  }).isRequired,
  onTextWindowSizeChange: PropTypes.func.isRequired,
  onBookInfoChange: PropTypes.func.isRequired,
  offset: PropTypes.number.isRequired,
};

export default XmlTextWindow;
