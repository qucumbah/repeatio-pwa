/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import PropTypes from 'prop-types';

import BookRenderer from './BookRenderer';

const BookUI = ({ source }) => {
  const [offset, setOffset] = useState(0);

  const prevPage = () => {

  };
  const nextPage = () => {

  };

  return (
    <div className="bookUI">
      <div className="leftButton" onClick={prevPage} />
      <BookRenderer source={source} />
      <div className="rightButton" onClick={nextPage} />
    </div>
  );
};

BookUI.propTypes = {
  source: PropTypes.string.isRequired,
};

export default BookUI;
