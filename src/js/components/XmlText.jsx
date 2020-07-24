import React from 'react';
import PropTypes from 'prop-types';

import Fb2Text from './Fb2Text';
import EpubText from './EpubText';

const XmlText = ({ book, onBookInfoChange, textRef }) => {
  const getFb2Text = () => (
    <Fb2Text
      source={book.source}
      onBookInfoChange={onBookInfoChange}
      ref={textRef}
    />
  );

  const getEpubText = () => (
    <EpubText
      source={book.source}
      onBookInfoChange={onBookInfoChange}
      ref={textRef}
    />
  );

  return book.format === 'fb2' ? getFb2Text() : getEpubText();
};

XmlText.propTypes = {
  book: PropTypes.shape({
    format: PropTypes.string,
    source: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string)
    ]),
  }).isRequired,
  onBookInfoChange: PropTypes.func.isRequired,
  textRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
};

export default XmlText;
